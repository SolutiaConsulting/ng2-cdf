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
                    let requestModel = 
                    {
                        "ApplicationKey" : CONNECTION_CREDENTIALS.ApplicationKey,
						"ScopeList": CONNECTION_CREDENTIALS.ScopeList
                    };

					let url =  this.CDF_WEBAPI_BASE_URL + "/google/generate-token";

					let headers = new Headers({ 'Content-Type': 'application/json'});

					let newTokenSubscription = this.http.post(url, JSON.stringify(requestModel), { headers })
							.map(res => res.json())
							.subscribe (
								//SUCCESS
								data =>
								{
									//console.log('************************ GOOGLE DOMAIN MODEL NEW TOKEN:', data);

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
}