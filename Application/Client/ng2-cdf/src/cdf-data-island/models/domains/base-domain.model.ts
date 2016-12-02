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

    HasToken(domainName:string): boolean
	{
		return (this.GetToken(domainName) != undefined);
	};

    GetToken(domainName:string): string
	{
		//console.log('GET TOKEN DOMAIN:', domainName);

		var authTokenStorage = (localStorage.getItem(domainName)) ? JSON.parse(localStorage.getItem(domainName)) : undefined;
		return (authTokenStorage && authTokenStorage.access_token) ? authTokenStorage.access_token : undefined;
	};

	SetToken(domainName:string, token: any): void
	{
		// console.log('SET TOKEN DOMAIN:', domainName);
		// console.log('SET TOKEN:', token);

		localStorage.setItem(domainName, JSON.stringify(token));
	}

	DeleteToken(domainName:string): void
	{ 
		//console.log('DELETE TOKEN DOMAIN:', domainName);

		if (localStorage.getItem(domainName))
		{ 
			localStorage.removeItem(domainName);
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
		console.log('ERROR - AuthenticateObservable MUST BE IMPLEMENTED IN DOMAIN SPECIFIC MODEL THAT EXTENDS BaseDomainModel');
		return undefined;
	};

	//PHYSICAL HTTP GET CALL TO DOMAIN FOR RESULT DATA...
	HttpGet(url: string): Observable<any>
	{
		let domainName = CdfDomainService.GetDomainNameFromUrl(url);
		let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
		let options = new RequestOptions({ headers: headers });				
        let token = this.GetToken(domainName);
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
		let domainName = CdfDomainService.GetDomainNameFromUrl(postModel.URL);
        let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
        let options = new RequestOptions({ headers: headers });		
		
        //APPEND TO HEADER: Authorization : Bearer [token]
        if (this.HasToken(domainName))
        {
            options.headers.append('Authorization', 'Bearer ' + this.GetToken(domainName));
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