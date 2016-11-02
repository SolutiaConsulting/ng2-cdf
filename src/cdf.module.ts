import { NgModule, ModuleWithProviders }	from '@angular/core';
import { CommonModule }						from '@angular/common';

import
{
	//CDF-DATA-ISLAND
	CacheService,
	CdfConfigModel,
	CdfDataHelperService,
	CdfDataIslandComponent,
	CdfDataService,
	CdfSettingsService,

	//CDF-MEDIA
	CdfImageComponent,
	CdfMediaComponent,
	CdfMediaSliderComponent,
	CdfVideoComponent
} 											from './index';


//CREATE AN INSTANCE OF THE SETTINGS SERVICE BY CONSUMING A PROVIDED CONFIGURATION
// http://blog.rangle.io/configurable-services-in-angular-2/
import { provideSettingsService } 			from './cdf-data-island/services/cdf-settings.service';


@NgModule({
	imports:
	[
		CommonModule
	],
	declarations:
	[
		//CDF-DATA-ISLAND
		CdfDataIslandComponent,
	
		// //CDF-MEDIA
		CdfImageComponent,
		CdfMediaComponent,
		CdfMediaSliderComponent,
		CdfVideoComponent
	],
	exports:
	[
		// //CDF-DATA-ISLAND
		CdfDataIslandComponent,
	
		// //CDF-MEDIA
		CdfMediaComponent,
		CdfMediaSliderComponent
	],
	providers:
	[
		CacheService,
		CdfDataHelperService,
		CdfDataService,
		CdfSettingsService
	]
})
export class CdfModule 
{
	static forRoot(config: CdfConfigModel[]): ModuleWithProviders
	{
		return {
			ngModule: CdfModule,
			providers:
			[ 
				[provideSettingsService(config)]
			]
		};
	}	
}