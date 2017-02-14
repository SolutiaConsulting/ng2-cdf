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

import { CdfDomainService }		from '../../services/index'; 
import { ClientConfigService }	from '../../../services/index';
import 
{ 
	CdfPostModel,
	CdfRequestModel 
}								from '../index';
import { BaseDomainModel }      from './base-domain.model';

@Injectable()
export class ApiCloudCmsModel extends BaseDomainModel
{
    http: Http;

    constructor () 
    { 
        super();

        this.http = super.InjectHttp();  
    }  

	AuthenticateObservable(errorUrl: string) : Observable<any>
	{
		//RETRIEVE DOMAIN OF URL IN ERROR SO WE CAN RETRIEVE THE CORRECT CREDENTIALS IN ORDER TO TRY AND RE-ESTABLISH AUTHENTCATION
		let errorDomainName = CdfDomainService.GetDomainNameFromUrl(errorUrl);

		//DELETE TOKEN
		super.DeleteToken(errorDomainName);

		return Observable.create(observer => 
		{
			var authToken = (super.HasToken(errorDomainName)) ? super.GetTokenValueFromStorage(errorDomainName) : undefined;		
			
			if (authToken)
			{
				//COMPLETE THIS LEG OF OBSERVER, RETURN TOKEN
				observer.next(authToken);
				observer.complete();
			}
			else
			{
                let CONNECTION_CREDENTIALS = ClientConfigService.GetConfigModelByDomainName(errorDomainName);

                if(CONNECTION_CREDENTIALS)
                {
                    let headers = new Headers({ 'Content-Type': 'application/json' }); 	// ... Set content type to JSON
                    let options = new RequestOptions({ headers: headers });		
                                                
                    //console.log('************* POST BODY *************:', JSON.stringify(postModel.Body));

                    let requestModel = 
                    {
                        "ApplicationKey" : CONNECTION_CREDENTIALS.ApplicationKey
                    };						

                    let postUrl = ClientConfigService.CDF_WEBAPI_BASE_URL + '/cloudcms/generate-token';

                    let newTokenSubscription = this.http.post(postUrl, JSON.stringify(requestModel), options)
                        .map(res => res.json())
                        .subscribe (
                            //SUCCESS
                            data =>
                            {
                                //console.log('NEW TOKEN YO YO', data);

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