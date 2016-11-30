import { Injectable }           from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import 
{ 
	Http,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response
} 								from '@angular/http';

import 
{ 
	CdfDomainService,
	CdfSettingsService 
}								from '../../services/index'; 
import 
{ 
	CdfPostModel,
	CdfRequestModel 
}								from '../index';
import { BaseDomainModel }      from './base-domain.model';

@Injectable()
export class ApiGoogleModel extends BaseDomainModel
{
    readonly CDF_WEBAPI_BASE_URL = 'http://cdf.webapi.solutiaconsulting.com/api';

    http: Http;

    constructor () 
    { 
        super();

		this.http = super.InjectHttp();         
    }     

	AuthenticateObservable(errorUrl: string, cdfSettingsService: CdfSettingsService) : Observable<any>
	{
		//RETRIEVE DOMAIN OF URL IN ERROR SO WE CAN RETRIEVE THE CORRECT CREDENTIALS IN ORDER TO TRY AND RE-ESTABLISH AUTHENTCATION
		let errorDomain = CdfDomainService.GetDomainFromUrl(errorUrl);

		//DELETE TOKEN
		super.DeleteToken(errorDomain);


		return Observable.create(observer => 
		{
			var authToken = super.GetToken(errorDomain);		
			
			if (authToken)
			{
				//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN
				observer.next(authToken);
				observer.complete();
			}
			else
			{
				let CONNECTION_CREDENTIALS = cdfSettingsService.GetConfigModelByDomainName(errorDomain);

                if(CONNECTION_CREDENTIALS)
                {
					let url =  this.CDF_WEBAPI_BASE_URL + "/google/generate-token";

					//TODO: GET BODY JSON FROM CONNECTION_CREDENTIALS...
					let body = 
					{
						"ApplicationKey": "42d28aaf-0cef-4433-bb9b-0981fd06375a",
						"ScopeList": 
						[
							"https://www.googleapis.com/auth/youtube"
						]
					};

					let headers = new Headers({ 'Content-Type': 'application/json'});

					let newTokenSubscription = this.http.post(url, body, { headers })
							.map(res => res.json())
							.subscribe (
								//SUCCESS
								data =>
								{
									console.log('************************ GOOGLE DOMAIN MODEL NEW TOKEN:', data);

									//SET TOKEN RECEIVED FROM API
									super.SetToken(CONNECTION_CREDENTIALS.Domain, data);

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
        });
	};

	//PHYSICAL HTTP GET CALL TO DOMAIN FOR RESULT DATA...
	// HttpGet(url: string): Observable<any>
	// {
	// 	let domain = CdfDomainService.GetDomainFromUrl(url);
	// 	let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
	// 	let options = new RequestOptions({ headers: headers });		
    //     let token = super.GetToken(domain);
    //     let bearerToken = (token) ? token : 'TOKEN-NOT-KNOWN';
    //     let urlFragment = url.replace('https://api.twitter.com/1.1/','');
    //     let urlFragmentHash = super.HashUrlFragment(urlFragment);
    //     let twitterUrl = this.CDF_WEBAPI_BASE_URL + '/twitter/get/' + urlFragmentHash;

    //     // console.log('BEARER TOKEN:', bearerToken);   
    //     // console.log('GOOGLE FRAGMENT:', urlFragment);
    //     // console.log('GOOGLE FRAGMENT HASH:', urlFragmentHash);
    //     // console.log('GOOGLE URL', twitterUrl);
    //     // console.log('--------------------------------------------------------------------------'); 

    //     //APPEND TO HEADER:
    //     options.headers.append('BearerToken', bearerToken);
    //     options.headers.append('UrlFragment', urlFragment);					
    //     options.body = '';
        
    //     return this.http.get(twitterUrl, options).map((res: Response) => res.json());
	// };	
    
	//PHYSICAL HTTP POST CALL TO DOMAIN FOR RESULT DATA...
	HttpPost(postModel: CdfPostModel): Observable<any>
	{ 
		let domain = CdfDomainService.GetDomainFromUrl(postModel.URL);
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });				
		let urlFragment = postModel.URL.replace('https://api.twitter.com/1.1/','');
                                    
        //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

        let requestModel = 
        {
            "BearerToken" : super.GetToken(domain),
            "UrlFragment" : urlFragment,
            "PostBody" : postModel.Body
        };

        let postUrl = this.CDF_WEBAPI_BASE_URL + '/twitter/post/request';

        return this.http.post(postUrl, JSON.stringify(requestModel), options).map((res: Response) => res.json());
	};    
}