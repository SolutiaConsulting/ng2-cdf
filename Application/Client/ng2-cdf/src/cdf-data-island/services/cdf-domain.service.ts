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
    static readonly CDF_DOMAIN = 'cdf.webapi.solutiaconsulting.com';
    static readonly CDF_DOMAIN_PROXY_LIST = 
    [
        {
            name : 'twitter',
            domain : 'api.twitter.com'
        },
        {
            name : 'google',
            domain : 'googleapis.com'
        }
    ];

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
                { provide: 'googleapis.com', useClass: ApiGoogleModel },
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
        let cdfDomainIndex = domain.indexOf(CdfDomainService.CDF_DOMAIN);

        //IF URL IS ACTUALL CDF WEB API, THEN DIG DEEPER TO SEE IF URL CONTAINS
        //CLUES AS TO WHAT DOMAIN CDF WEB API IS ACTING UPON
        //LOOK TO PATH OF CDF WEB API FOR CLUES (TWITTER, GOOGLE, ETC)
        if(cdfDomainIndex > -1)
        {

            CdfDomainService.CDF_DOMAIN_PROXY_LIST.some
            (
                function(proxy) 
                {
                    let proxyIndex = url.indexOf(proxy.name);

                    if(proxyIndex > -1)
                    {
                        domain = proxy.domain;
                        return true;
                    }                
                }
            );
        }
		
		return domain;
	};      
}