import { NgModule, ModuleWithProviders }	from '@angular/core';
import { CommonModule }						from '@angular/common';

import
{
	//SERVICES
	CacheService,
	CdfDataHelperService,
	CdfDataService,
	ClientConfigService,

	//COMPONENTS
	CdfDataIslandComponent,

	//MODELS
	CdfClientConfigModel,

	//APPLICATION MODULES
	CdfContactUsFormModule,
	CdfMediaModule,
	CdfTweetModule,
	CdfYouTubeModule,
} 											from './index';


@NgModule({
	imports:
	[
		CommonModule
	],
	declarations:
	[
		//CDF-DATA-ISLAND
		CdfDataIslandComponent
	],
	exports:
	[
		//CONTACT US FORM
		CdfContactUsFormModule,

		// CDF-DATA-ISLAND
		CdfDataIslandComponent,
	
		// CDF-MEDIA
		CdfMediaModule,

		//CDF-TWEET
		CdfTweetModule,	

		//CDF-YOUTUBE
		CdfYouTubeModule
	],
	providers:
	[
		CacheService,
		CdfDataHelperService,
		CdfDataService
	]
})
export class CdfModule 
{
	static forRoot(clientConfigModel: CdfClientConfigModel): ModuleWithProviders
	{
		ClientConfigService.CdfClientConfigModel = clientConfigModel;

		return {
			ngModule: CdfModule,
			providers:
			[ 
			]
		};
	}	
}