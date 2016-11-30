import { ReflectiveInjector}    from '@angular/core';
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

import { BaseDomainInterface }  from './base-domain.interface';
import { CdfPostModel }			from '../cdf-post.model';
import 
{ 
	CdfDomainService,
	CdfSettingsService 
}								from '../../services/index'; 

export class BaseDomainModel implements BaseDomainInterface 
{
	http: Http;

    constructor () 
	{
		this.http = this.InjectHttp();  
    }

	InjectHttp() : Http
	{
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

		return injector.get(Http);  		
	};

    HasToken(domain:string): boolean
	{
		return (this.GetToken(domain) != undefined);
	};

    GetToken(domain:string): string
	{
		//console.log('GET TOKEN DOMAIN:', domain);

		var authTokenStorage = (localStorage.getItem(domain)) ? JSON.parse(localStorage.getItem(domain)) : undefined;
		return (authTokenStorage && authTokenStorage.access_token) ? authTokenStorage.access_token : undefined;
	};

	SetToken(domain:string, token: any): void
	{
		// console.log('SET TOKEN DOMAIN:', domain);
		// console.log('SET TOKEN:', token);

		localStorage.setItem(domain, JSON.stringify(token));
	}

	DeleteToken(domain:string): void
	{ 
		//console.log('DELETE TOKEN DOMAIN:', domain);

		if (localStorage.getItem(domain))
		{ 
			localStorage.removeItem(domain);
		}	
	};	

	HashUrlFragment(urlFragment : string) : number
	{
		let hash = 5381;

		for (let i = 0; i < urlFragment.length; i++) 
		{
			let char = urlFragment.charCodeAt(i);
			hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
		}

		return hash;		
	};

	AuthenticateObservable(errorUrl: string, cdfSettingsService: CdfSettingsService) : Observable<any>
	{
		//RETRIEVE DOMAIN OF URL IN ERROR SO WE CAN RETRIEVE THE CORRECT CREDENTIALS IN ORDER TO TRY AND RE-ESTABLISH AUTHENTCATION
		let errorDomain = CdfDomainService.GetDomainFromUrl(errorUrl);

		//DELETE TOKEN
		this.DeleteToken(errorDomain);


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
                let CONNECTION_CREDENTIALS = cdfSettingsService.GetConfigModelByDomainName(errorDomain);

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
        });
	};

	//PHYSICAL HTTP GET CALL TO DOMAIN FOR RESULT DATA...
	HttpGet(url: string): Observable<any>
	{
		let domain = CdfDomainService.GetDomainFromUrl(url);
		let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });				
        let token = this.GetToken(domain);
        let bearerToken = (token) ? 'Bearer ' + token : 'TOKEN-NOT-KNOWN';
                
        //APPEND TO HEADER:
        options.headers.append('Authorization', bearerToken);
        options.body = '';
        
        console.log('BASE DOMAIN BEARER TOKEN:', bearerToken);   
        console.log('BASE DOMAIN URL', url);
        console.log('--------------------------------------------------------------------------'); 		

        return this.http.get(url, options).map((res: Response) => res.json());
	};	
    
	//PHYSICAL HTTP POST CALL TO DOMAIN FOR RESULT DATA...
	HttpPost(postModel: CdfPostModel): Observable<any>
	{ 
		let domain = CdfDomainService.GetDomainFromUrl(postModel.URL);
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });		
		
        //APPEND TO HEADER: Authorization : Bearer [token]
        if (this.HasToken(domain))
        {
            options.headers.append('Authorization', 'Bearer ' + this.GetToken(domain));
            options.headers.append('Access-Control-Allow-Origin', '*');
        }
                        
        //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

        return this.http.post(postModel.URL, JSON.stringify(postModel.Body), options).map((res: Response) => res.json());
	};



	static CreateDefaultCookieXSRFStrategy() 
	{
		return new CookieXSRFStrategy();
	}

	static HttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions): Http 
	{
		return new Http(xhrBackend, requestOptions);
	}	
}