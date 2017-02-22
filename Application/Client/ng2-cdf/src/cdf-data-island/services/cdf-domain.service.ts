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
    BaseDomainModel,
    BaseDomainInterface
}	                            from '../models/index'; 
import { ClientConfigService }  from '../../services/index';

@Injectable()
export class CdfDomainService 
{	    
    static readonly CDF_DOMAIN_PROXY_LIST = 
    [
        {
            name : 'cloudcms',
            domain : 'api.cloudcms.com',
            provide: 'api.cloudcms.com',
            useClass: ApiCloudCmsModel
        },        
        {
            name : 'twitter',
            domain : 'api.twitter.com',
            provide: 'api.twitter.com',
            useClass: ApiTwitterModel
        },
        {
            name : 'google',
            domain : 'googleapis.com',
            provide: 'googleapis.com',
            useClass: ApiGoogleModel
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
        let isDomainKnown = CdfDomainService.CDF_DOMAIN_PROXY_LIST.some(function (providerItem) 
        {
            let providerIndex = domainName.indexOf(providerItem.domain);

            // console.log('**************** providerItem:', providerItem);
            // console.log('**************** providerIndex:', providerIndex);
        
            return (providerIndex > -1);
        }); 

        // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  DOMAIN:', domainName); 
        // console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX  IS DOMAIN KNOWN:', isDomainKnown);        

        if (isDomainKnown)
        {
            let injector = ReflectiveInjector.resolveAndCreate( CdfDomainService.CDF_DOMAIN_PROXY_LIST );
            return injector.get(domainName);                        
        }
        else
        { 
            return new BaseDomainModel();
        }
    };

    static GetDomainNameFromUrl(url:string) : string
	{
		let matches = url.match(/^https?\:\/\/(?:www\.)?([^\/?#]+)(?:[\/?#]|$)/i);
		let domain: string = matches && matches[ 1 ];
        let cdfDomainIndex = domain.indexOf(ClientConfigService.CDF_WEBAPI_BASE_URL);

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