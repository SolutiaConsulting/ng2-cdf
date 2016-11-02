import { Injectable } 		from '@angular/core';

import
{
	CdfConfigModel
} 							from '../models/index';

@Injectable()
export class CdfSettingsService 
{	

	ConfigList : CdfConfigModel[] = [];

	constructor(
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

export function provideSettingsService(configList:CdfConfigModel[]) 
{
	return { provide: CdfSettingsService, useFactory: () => new CdfSettingsService(configList) }
}