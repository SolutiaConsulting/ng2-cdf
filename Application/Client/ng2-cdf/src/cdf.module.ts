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
	CdfVideoBackgroundComponent,
	CdfVideoYouTubeComponent
} 											from './index';


//CREATE AN INSTANCE OF THE SETTINGS SERVICE BY CONSUMING A PROVIDED CONFIGURATION
// http://blog.rangle.io/configurable-services-in-angular-2/
import { provideCdfSettingsService } 		from './cdf-data-island/services/cdf-settings.service';
import { provideCdfVideoSettingsService } 	from './cdf-media/components/video/cdf-video-settings.service';


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
		CdfVideoBackgroundComponent,
		CdfVideoYouTubeComponent
	],
	exports:
	[
		// CDF-DATA-ISLAND
		CdfDataIslandComponent,
	
		// CDF-MEDIA COMPONENTS TO BE USED IN CLIENT APPS...
		CdfVideoBackgroundComponent,
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
	static forRoot(cdfConfigModel: CdfConfigModel[], jwPlayerKey: string): ModuleWithProviders
	{
		return {
			ngModule: CdfModule,
			providers:
			[ 
				[provideCdfSettingsService(cdfConfigModel)],
				[provideCdfVideoSettingsService(jwPlayerKey)]
			]
		};
	}	
}