import { Injectable } 			from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import {
	Http,
	Request,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response} 					from '@angular/http';

import { CacheService }			from '../storage/cache.service';
import { CdfSettings }			from '../settings/cdf-settings'; 
import { cdfRequestModel }		from '../models/cdf-model-request';
import { cdfPostModel } 		from '../models/cdf-model-post';

@Injectable()
export class DataIslandService
{
	tokenName: string = 'cdf-token';

	constructor(
		private http: Http,
		private cacheService: CacheService
	)
	{ 
	}

	requestData(requestModel: cdfRequestModel, options?: RequestOptionsArgs): Observable<any> 
	{
		let cacheKey = (requestModel.CacheKey) ? requestModel.CacheKey : undefined;

		// console.log('CDF SERVICE DATA ISLAND REQUEST...', requestModel);
		// console.log('CDF SERVICE DATA ISLAND cacheKey...', cacheKey);

		if (cacheKey && this.cacheService.exists(cacheKey))
		{ 
			var cahcedData = this.cacheService.get(cacheKey);			
			//console.log('cahcedData', cahcedData);

			return Observable.create(observer => 
			{
				observer.next(cahcedData);
				observer.complete();
			});
		}
		else
		{					
			return Observable.create(observer => 
			{
				//JOIN ALL REQUESTS TOGETHER INTO A BATCH TO BE FORKED....
				let observableBatch = [];	

				//ADD OBSERVABLE FOR AN ARRAY OF GET REQUESTS				
				if (requestModel.GetList)
				{
					for (let item in requestModel.GetList) 
					{
						observableBatch.push(this.HttpGet(requestModel.GetList[ item ]));
					}
				}	
																
				//ADD OBSERVABLE FOR AN ARRAY OF POST REQUESTS
				if (requestModel.PostList)
				{
					for (let item in requestModel.PostList) 
					{
						observableBatch.push(this.HttpPost(requestModel.PostList[ item ]));
					}					
				}	

				//console.log('**************** observableBatch:', observableBatch);
				
				/*
				FORK JOIN RETURNS AN ARRAY OF RESULT SETS (1 FOR EACH REQUEST IN FORK JOIN)
				THIS OBSERVABLE, IF SUCCESSFUL, RETURNS THE FOLLOWING:
				[1..N] - THE RAW JSON FROM CMS SERVICE
				*/
				let forkJoinSubscription = Observable.forkJoin(observableBatch)
					.subscribe (
						//SUCCESS, WE HAVE JSON RESPONSE FROM SERVICE
						data =>
						{						
							//console.log('FORK JOIN SUCCESS !!! - JSON FROM CMS SERVICE (cdf-data-service)', data);
							
							//CACHE RESULTS FOR 1 HOUR...		
							var cacheExpires = Date.now() + 1000 * 60 * 60;

							/*
							data is an array of result sets from forkJoin.
							each item in array is the JSON data results from service call
							*/
							if (data instanceof Array && data.length > 1)
							{
								let resultsArray = [];

								for (let dataIndex in data) 
								{
									if (data[dataIndex] instanceof Object)
									{ 
										resultsArray.push(data[ dataIndex ]);
									}	
								}

								//CACHE RESULTS FOR 1 HOUR...		
								if (cacheKey)
								{ 
									this.cacheService.set(cacheKey, resultsArray, {expires: cacheExpires});
								}								

								//THROW RESPONSE JSON INTO THE STREAM...
								observer.next(resultsArray);
								observer.complete();							
							}
							else
							{
								//CACHE RESULTS FOR 1 HOUR...			
								if (cacheKey)
								{
									this.cacheService.set(cacheKey, data[0], {expires: cacheExpires});
								}												
																
								//THROW RESPONSE JSON INTO THE STREAM...
								observer.next(data[0]);
								observer.complete();
							}
						},
					
						//ERROR
						err =>
						{
							//console.log('FORK JOIN ERROR...', err);
							
							//THIS HAPPENS WHEN TOKEN HAS EXPIRED
							//SO, NEED TO RE-ESTABLISH A NEW TOKEN...
							if (err.status === 401) 
							{
								let errorUrl = (err.url) ? err.url : this.GetFirstUrl(requestModel);

								if (errorUrl)
								{
									//RETRIEVE DOMAIN OF URL IN ERROR SO WE CAN RETRIEVE THE CORRECT CREDENTIALS IN ORDER TO TRY AND RE-ESTABLISH AUTHENTCATION
									let matches = errorUrl.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
									let domain: string = matches && matches[ 1 ];

									//console.log('error domain:', domain);

									//DELETE TOKEN
									this.DeleteToken();
									
									//RETRY AUTHENTICATE OBSERVABLE FOR A NEW TOKEN		
									let authenticateObservableSubscription = this.authenticateObservable(domain)
										.subscribe(
											//SUCCESS
											newToken =>
											{
												//console.log('AUTHENTICATE OBSERVABLE DATA (NEW TOKEN):', newToken);

												//THROW ERROR SO RETRY ATTEMPTS GET INITIATED  (SEE retryWhen IN CDF-DATA.COMPONENT.TS) 
												//AT THIS POINT, WE HAVE A SHINY NEW VALID TOKEN FROM WHICH TO GET DATA...
												observer.error(err);
											},
												
											//ON ERROR
											() => null,

											//ON COMPLETE
											() =>
											{
												if (authenticateObservableSubscription)
												{
													authenticateObservableSubscription.unsubscribe();
												}
												//console.log('AUTHENTICATE RETRY COMPELETED');
											}
										);
								}
								else
								{ 
									observer.error(err);
								}
							}
							else
							{
								//this.errorService.notifyError(err);
								observer.error(err);
							}
						},

						//COMPLETE
						() =>
						{
							if (forkJoinSubscription)
							{ 
								forkJoinSubscription.unsubscribe();
							}							
							
							//console.log('FORK JOIN COMPELETED');
						}
				);			
			});
		}
	}
	
	private authenticateObservable(errorDomain: string) 
	{
		return Observable.create(observer => 
		{
			var authToken = this.GetToken();		
			
			if (authToken)
			{
				//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN
				observer.next(authToken);
				observer.complete();
			}
			else
			{
				//RETRIEVE A NEW TOKEN
				var CONNECTION_CREDENTIALS = CdfSettings.DOMAIN_CREDENTIALS[errorDomain];
				var authorization = 'Basic ' + btoa(CONNECTION_CREDENTIALS.clientKey + ':' + CONNECTION_CREDENTIALS.clientSecret);
				var url = CONNECTION_CREDENTIALS.baseURL + '/oauth/token?grant_type=password&scope=api&username=' + CONNECTION_CREDENTIALS.username + '&password=' + CONNECTION_CREDENTIALS.password;
				var body = '';
				var headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': authorization });

				let newTokenSubscription = this.http.post(url, body, { headers })
					.map(res => res.json())
					.subscribe (
						//SUCCESS
						data =>
						{
							//console.log('NEW TOKEN YO YO', data);

							//SET TOKEN RECEIVED FROM API
							this.SetToken(data);

							//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN 
							observer.next(data);
							observer.complete();
						},

						//ERROR
						err =>
						{ 
							//console.log('authenticateObservable error smalls:', err);
						},

						//COMPLETE
						() =>
						{ 
							if (newTokenSubscription)
							{ 
								newTokenSubscription.unsubscribe();
							}							
						}
					)
			}
        });
	};
	
	private HasToken(): boolean
	{
		return (this.GetToken() != undefined);
	};
	
	private GetToken(): string
	{
		//return '9360b7c4-c3b3-4775-8ff8-03b5794f64ba';
		var authTokenStorage = (localStorage.getItem(this.tokenName)) ? JSON.parse(localStorage.getItem(this.tokenName)) : undefined;
		return (authTokenStorage && authTokenStorage.access_token) ? authTokenStorage.access_token : undefined;
	};	

	private SetToken(data: any): void
	{
		//console.log('WRITE TOKEN TO LOCAL STORAGE...', data);
		localStorage.setItem(this.tokenName, JSON.stringify(data));
	}

	private DeleteToken(): void
	{ 
		if (localStorage.getItem(this.tokenName))
		{ 
			localStorage.removeItem(this.tokenName);
		}	
	};	


	//PHYSICAL HTTP GET CALL TO CLOUD CMS FOR CONTENT...	
	private HttpGet(url: string): Observable<any>
	{
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); 			// Create a request option
		
		//APPEND TO HEADER: Authorization : Bearer [token]
		if (this.HasToken())
		{
			options.headers.append('Authorization', 'Bearer ' + this.GetToken());
			options.headers.append('Access-Control-Allow-Origin', '*');
		}
				
		options.body = '';
		
		return this.http.get(url, options).map((res: Response) => res.json());
	};	

	//PHYSICAL HTTP POST CALL TO CLOUD CMS FOR CONTENT...
	private HttpPost(postModel: cdfPostModel): Observable<any>
	{ 
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });		
		
		//APPEND TO HEADER: Authorization : Bearer [token]
		if (this.HasToken())
		{
			options.headers.append('Authorization', 'Bearer ' + this.GetToken());
			options.headers.append('Access-Control-Allow-Origin', '*');
		}
						
		//console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

		return this.http.post(postModel.URL, JSON.stringify(postModel.Body), options).map((res: Response) => res.json());
	};	


	private GetFirstUrl(requestModel: cdfRequestModel) : string
	{ 
		if (requestModel.GetList && requestModel.GetList.length > 0)
		{
			return requestModel.GetList[ 0 ];
		}		
		else if (requestModel.PostList && requestModel.PostList.length > 0)
		{ 
			return requestModel.PostList[ 0 ].URL;
		}
		
		return undefined;
	};	
}