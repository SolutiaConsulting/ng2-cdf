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
import 
{ 
	CdfPostModel,
	CdfRequestModel 
}								from '../models/index';
import { CdfSettingsService }	from './cdf-settings.service'; 

@Injectable()
export class CdfDataService
{
	readonly CDF_DOMAIN = 'webapi.solutiaconsulting.com';
	readonly CDF_WEBAPI_BASE_URL = 'http://cdf.webapi.solutiaconsulting.com/api';
	readonly TWITTER_DOMAIN = 'api.twitter.com';
	readonly TWITTER_API_URL = 'https://api.twitter.com/1.1/';

	constructor(
		private http: Http,
		private cacheService: CacheService,
		private cdfSettingsService: CdfSettingsService
	)
	{ 
	}

	requestData(requestModel: CdfRequestModel, options?: RequestOptionsArgs): Observable<any> 
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
					for (let url in requestModel.GetList) 
					{						
						observableBatch.push(this.HttpGet(requestModel.GetList[ url ]));
					}
				}	
																
				//ADD OBSERVABLE FOR AN ARRAY OF POST REQUESTS
				if (requestModel.PostList)
				{
					for (let url in requestModel.PostList) 
					{
						observableBatch.push(this.HttpPost(requestModel.PostList[ url ]));
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
									let domain = this.GetDomainFromUrl(errorUrl);
									
									//console.log('error domain:', domain);

									//DELETE TOKEN
									this.DeleteToken(domain);
									
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
			var authToken = this.GetToken(errorDomain);		
			
			if (authToken)
			{
				//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN
				observer.next(authToken);
				observer.complete();
			}
			else
			{
				let isTwitter = this.IsTwitterRequest(errorDomain);

				if(isTwitter)
				{
					let CONNECTION_CREDENTIALS = this.cdfSettingsService.GetConfigModelByDomainName(this.TWITTER_DOMAIN);

					if(CONNECTION_CREDENTIALS)
					{
						let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
						let options = new RequestOptions({ headers: headers });		
													
						//console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

						let requestModel = 
						{
							"EncodedCredentials" : CONNECTION_CREDENTIALS.EncodedCredentials
						};						

						let postUrl = this.CDF_WEBAPI_BASE_URL + '/twitter/authenticate';

						let newTokenSubscription = this.http.post(postUrl, JSON.stringify(requestModel), options)
							.map(res => res.json())
							.subscribe (
								//SUCCESS
								data =>
								{
									//console.log('NEW TOKEN YO YO', data);

									//SET TOKEN RECEIVED FROM API
									this.SetToken(CONNECTION_CREDENTIALS.Domain, data);

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
				}
				else
				{
					let CONNECTION_CREDENTIALS = this.cdfSettingsService.GetConfigModelByDomainName(errorDomain);

					if(CONNECTION_CREDENTIALS)
					{
						let authorization = 'Basic ' + CONNECTION_CREDENTIALS.EncodedCredentials;
						let url = CONNECTION_CREDENTIALS.OAuthURL;
						let body = CONNECTION_CREDENTIALS.Body;
						let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': authorization });

						let newTokenSubscription = this.http.post(url, body, { headers })
							.map(res => res.json())
							.subscribe (
								//SUCCESS
								data =>
								{
									//console.log('NEW TOKEN YO YO', data);

									//SET TOKEN RECEIVED FROM API
									this.SetToken(CONNECTION_CREDENTIALS.Domain, data);

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
				}
			}
        });
	};
	
	private HasToken(domain:string): boolean
	{
		return (this.GetToken(domain) != undefined);
	};
	
	private GetToken(domain:string): string
	{
		//console.log('GET TOKEN DOMAIN:', domain);

		var authTokenStorage = (localStorage.getItem(domain)) ? JSON.parse(localStorage.getItem(domain)) : undefined;
		return (authTokenStorage && authTokenStorage.access_token) ? authTokenStorage.access_token : undefined;
	};	

	private SetToken(domain:string, token: any): void
	{
		// console.log('SET TOKEN DOMAIN:', domain);
		// console.log('SET TOKEN:', token);

		localStorage.setItem(domain, JSON.stringify(token));
	}

	private DeleteToken(domain:string): void
	{ 
		//console.log('DELETE TOKEN DOMAIN:', domain);

		if (localStorage.getItem(domain))
		{ 
			localStorage.removeItem(domain);
		}	
	};	

	private GetFirstUrl(requestModel: CdfRequestModel) : string
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

	//TWITTER DOES NOT PLAY WELL WITH CLIENT APPS, SO HAVE TO USE A PROXY FOR ALL TWITTER REQUESTS
	private IsTwitterRequest(url: string) : boolean
	{
		let twitterIndex = url.indexOf(this.TWITTER_DOMAIN);
		let ng2cdfIndex = url.indexOf(this.CDF_DOMAIN);
		let isTwitter = ((twitterIndex > -1) || (ng2cdfIndex > -1));

		return isTwitter;	
	};

	private GetDomainFromUrl(url:string) : string
	{
		let matches = url.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
		let domain: string = matches && matches[ 1 ];
		
		return domain;
	};




	//PHYSICAL HTTP GET CALL TO CLOUD CMS FOR CONTENT...	
	private HttpGet(url: string): Observable<any>
	{
		let domain = this.GetDomainFromUrl(url);
		let isTwitter = this.IsTwitterRequest(url);
		let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });		
		
		//TWITTER DOES NOT PLAY WELL WITH CLIENT APPS, SO HAVE TO USE A PROXY FOR ALL TWITTER REQUESTS
		if(isTwitter)
		{
			let bearerToken = this.GetToken(domain);
			let urlFragment = url.replace(this.TWITTER_API_URL,'');
			let urlFragmentHash = this.hashUrlFragment(urlFragment);
			let twitterUrl = this.CDF_WEBAPI_BASE_URL + '/twitter/get?requestModel.bearerToken=' + bearerToken + '&requestModel.urlFragment=' + urlFragment;

			return this.http.get(twitterUrl, options).map((res: Response) => res.json());
		}
		else
		{	
			//APPEND TO HEADER: Authorization : Bearer [token]
			if (this.HasToken(domain))
			{
				options.headers.append('Authorization', 'Bearer ' + this.GetToken(domain));
				options.headers.append('Access-Control-Allow-Origin', '*');
			}
					
			options.body = '';
			
			return this.http.get(url, options).map((res: Response) => res.json());
		}
	};	

	//PHYSICAL HTTP POST CALL TO CLOUD CMS FOR CONTENT...
	private HttpPost(postModel: CdfPostModel): Observable<any>
	{ 
		let domain = this.GetDomainFromUrl(postModel.URL);
		let isTwitter = this.IsTwitterRequest(postModel.URL);
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });		
		
		//TWITTER DOES NOT PLAY WELL WITH CLIENT APPS, SO HAVE TO USE A PROXY FOR ALL TWITTER REQUESTS
		if(isTwitter)
		{
			let urlFragment = postModel.URL.replace(this.TWITTER_API_URL,'');
										
			//console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

			let requestModel = 
			{
				"BearerToken" : this.GetToken(domain),
				"UrlFragment" : urlFragment,
				"PostBody" : postModel.Body
			};

			let postUrl = this.CDF_WEBAPI_BASE_URL + '/twitter/post/request';

			return this.http.post(postUrl, JSON.stringify(requestModel), options).map((res: Response) => res.json());
			
		}
		else
		{
			//APPEND TO HEADER: Authorization : Bearer [token]
			if (this.HasToken(domain))
			{
				options.headers.append('Authorization', 'Bearer ' + this.GetToken(domain));
				options.headers.append('Access-Control-Allow-Origin', '*');
			}
							
			//console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

			return this.http.post(postModel.URL, JSON.stringify(postModel.Body), options).map((res: Response) => res.json());
		}		
	};


	private hashUrlFragment(urlFragment : string) : number
	{
		var hash = 5381;
		for (i = 0; i < urlFragment.length; i++) 
		{
			char = urlFragment.charCodeAt(i);
			hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
		}

		return hash;		
	};			
}