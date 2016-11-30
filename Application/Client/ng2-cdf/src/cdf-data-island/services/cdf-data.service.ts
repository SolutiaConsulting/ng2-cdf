import { Injectable } 			from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import
{
	Http,
	Request,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response
} 								from '@angular/http';

import { CacheService }			from '../storage/cache.service';
import 
{ 
	CdfPostModel,
	CdfRequestModel 
}								from '../models/index';
import { CdfDomainService }		from './cdf-domain.service';
import { CdfSettingsService }	from './cdf-settings.service';  

@Injectable()
export class CdfDataService
{
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
					for (let urlIndex in requestModel.GetList) 
					{						
						let url = requestModel.GetList[ urlIndex ];
						let domainModel = CdfDomainService.GetDomainModel(url);

						//console.log('*****************  DOMAIN MODEL:', domainModel);

						observableBatch.push(domainModel.HttpGet(url));
					}
				}	
																
				//ADD OBSERVABLE FOR AN ARRAY OF POST REQUESTS
				if (requestModel.PostList)
				{
					for (let urlIndex in requestModel.PostList) 
					{
						let cdfPostModel = requestModel.PostList[ urlIndex ];
						let domainModel = CdfDomainService.GetDomainModel(cdfPostModel.URL);

						//console.log('*****************  DOMAIN MODEL:', domainModel);

						observableBatch.push(domainModel.HttpPost(cdfPostModel));
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
									let errorDomainModel = CdfDomainService.GetDomainModel(errorUrl);

									if(errorDomainModel)
									{
										//RETRY AUTHENTICATE OBSERVABLE FOR A NEW TOKEN		
										let authenticateObservableSubscription = errorDomainModel.AuthenticateObservable(errorUrl, this.cdfSettingsService)
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
	
	//STAYS...
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
}