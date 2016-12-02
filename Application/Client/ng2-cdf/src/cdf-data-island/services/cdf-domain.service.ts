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

    static GetDomainModelFromUrl(domainUrl: string) : BaseDomainInterface
    {
        let domainName = CdfDomainService.GetDomainNameFromUrl(domainUrl);

        return CdfDomainService.GetDomainModelFromDomainName(domainName);        
    };

    static GetDomainModelFromDomainName(domainName: string) : BaseDomainInterface
    {
        let injector = ReflectiveInjector.resolveAndCreate
        (
            [
                { provide: 'api.cloudcms.com', useClass: ApiCloudCmsModel },
                { provide: 'googleapis.com', useClass: ApiGoogleModel },
                { provide: 'api.twitter.com', useClass: ApiTwitterModel }
            ]
        );                

        let domainModel = injector.get(domainName);

        //TODO:  POSSIBLE CHECK IF DOMAIN IS NOT ONE SUPPORTED BY CDF (ie domainModel IS NOT FOUND THROUGH INJECTOR)...

        return domainModel;

    };

    static GetDomainNameFromUrl(url:string) : string
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