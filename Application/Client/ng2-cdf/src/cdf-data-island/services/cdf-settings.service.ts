import { Injectable } 		from '@angular/core';

import
{
	CdfConfigModel
} 							from '../models/index';

/*
THIS SERVICE IS HOW NG2-CDF GETS CONFIGURED.  THE CLIENT CONSUMING CDF MUST PROVIDE 
CONFIGURATION WHEN BOOTSTRAPPING APPLICATION:

@NgModule({
	imports:
	[
		CommonModule,
		RouterModule,

		//CONFIGURE CONTENT DELIVERY FRAMEWORK (CDF) WITH CREDENTIALS FOR DIFFERENT REST SOURCES		
		CdfModule.forRoot(configArray)
	],
	declarations:
	[
		//COMPONENTS
	],
	exports:
	[		
		//COMPONENTS

		//MODULES

		//APPLICATION MODULES

		//3RD PARTY...
		CdfModule		
	]
})


provideCdfSettingsService (AT BOTTOM OF THIS FILE)
 IS USED TO PROVIDE AN INSTANCE OF CdfSettingsService CONSUMING THE PROVIDED CONFIGURATIOM

http://blog.rangle.io/configurable-services-in-angular-2/

 */

@Injectable()
export class CdfSettingsService 
{	

	ConfigList : CdfConfigModel[] = [];

	constructor
	(
		private configList: CdfConfigModel[]
	)
	{ 
		this.ConfigList = configList;
	}


	GetConfigModelByDomainName(domainName: string) : CdfConfigModel
	{
		let configModel : CdfConfigModel;

		//FIND CONFIG IN LIST WITH SAME DOMAIN NAME
		for (let entry of this.ConfigList) 
		{
			if(entry.Domain.toUpperCase() === domainName.toUpperCase())
			{
				configModel = entry;
				break;
			}
		}

		return configModel;
	};
}

export function provideCdfSettingsService(configList:CdfConfigModel[]) 
{
	return { provide: CdfSettingsService, useFactory: () => new CdfSettingsService(configList) }
}