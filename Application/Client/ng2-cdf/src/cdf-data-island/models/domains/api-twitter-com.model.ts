import 
{ 
    Injectable, 
    ReflectiveInjector
}                               from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import
{
	Http,
	HttpModule,
	Request,
	RequestOptions,
	RequestOptionsArgs,
	Headers,
	Response,
	CookieXSRFStrategy,
	XHRBackend,
	BrowserXhr,
	BaseRequestOptions,
	ResponseOptions,
	BaseResponseOptions,
	XSRFStrategy
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
export class ApiTwitterModel extends BaseDomainModel
{
    readonly TWITTER_DOMAIN = 'api.twitter.com';
    readonly TWITTER_API_URL = 'https://api.twitter.com/1.1/';
    readonly CDF_WEBAPI_BASE_URL = 'http://cdf.webapi.solutiaconsulting.com/api';

    http: Http;

    constructor () 
    { 
        super();

        let injector = ReflectiveInjector.resolveAndCreate
        (
            [
				Http,
                HttpModule,
				{provide: Http, useFactory: BaseDomainModel.HttpFactory, deps: [XHRBackend, RequestOptions]},
				BrowserXhr,
				{provide: RequestOptions, useClass: BaseRequestOptions},
				{provide: ResponseOptions, useClass: BaseResponseOptions},
				XHRBackend,
				{provide: XSRFStrategy, useFactory: BaseDomainModel.CreateDefaultCookieXSRFStrategy}				
            ]
        );                 

		this.http = injector.get(Http);        
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
                let CONNECTION_CREDENTIALS = cdfSettingsService.GetConfigModelByDomainName(this.TWITTER_DOMAIN);

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
                                //console.log('************************ BASE DOMAIN MODEL NEW TOKEN:', data);

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
	HttpGet(url: string): Observable<any>
	{
		let domain = CdfDomainService.GetDomainFromUrl(url);
		let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });		
        let token = super.GetToken(domain);
        let bearerToken = (token) ? token : 'TOKEN-NOT-KNOWN';
        let urlFragment = url.replace(this.TWITTER_API_URL,'');
        let urlFragmentHash = super.HashUrlFragment(urlFragment);
        let twitterUrl = this.CDF_WEBAPI_BASE_URL + '/twitter/get/' + urlFragmentHash;

        // console.log('BEARER TOKEN:', bearerToken);   
        // console.log('TWITTER FRAGMENT:', urlFragment);
        // console.log('TWITTER FRAGMENT HASH:', urlFragmentHash);
        // console.log('TWITTER URL', twitterUrl);
        // console.log('--------------------------------------------------------------------------'); 

        //APPEND TO HEADER:
        options.headers.append('BearerToken', bearerToken);
        options.headers.append('UrlFragment', urlFragment);					
        options.body = '';
        
        return this.http.get(twitterUrl, options).map((res: Response) => res.json());
	};	
    
	//PHYSICAL HTTP POST CALL TO DOMAIN FOR RESULT DATA...
	HttpPost(postModel: CdfPostModel): Observable<any>
	{ 
		let domain = CdfDomainService.GetDomainFromUrl(postModel.URL);
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });				
        let urlFragment = postModel.URL.replace(this.TWITTER_API_URL,'');
                                    
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