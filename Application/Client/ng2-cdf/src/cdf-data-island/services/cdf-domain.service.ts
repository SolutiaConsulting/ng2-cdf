import 
{ 
    Injectable,
    ReflectiveInjector 
} 		                        from '@angular/core';

import 
{ 
    ApiCloudCmsModel,
    ApiGoogleModel,
    ApiTwitterModel,
    BaseDomainInterface
}	                            from '../models/index'; 

@Injectable()
export class CdfDomainService 
{	
	constructor()
	{ 
	}

    static GetDomainModel(domainUrl: string) : BaseDomainInterface
    {
        let domain = CdfDomainService.GetDomainFromUrl(domainUrl);
        
        let injector = ReflectiveInjector.resolveAndCreate
        (
            [
                { provide: 'api.cloudcms.com', useClass: ApiCloudCmsModel },
                { provide: 'www.googleapis.com', useClass: ApiGoogleModel },
                { provide: 'api.twitter.com', useClass: ApiTwitterModel }
            ]
        );                

        let domainModel = injector.get(domain);

        //TODO:  POSSIBLE CHECK IF DOMAIN IS NOT ONE SUPPORTED BY CDF...

        return domainModel;
    };

    static GetDomainFromUrl(url:string) : string
	{
		let matches = url.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
		let domain: string = matches && matches[ 1 ];
		
		return domain;
	};      
}