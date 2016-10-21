import { NgModule }						from '@angular/core';
import { CommonModule }					from '@angular/common';

import
{
	//CDF-DATA-ISLAND
	CacheService,
	CdfSettings,
	CdfDataIslandComponent,
	CdfDataIslandService,
	CdfPostModel,
	CdfRequestModel,

	
	//CDF-MEDIA
	CdfImageComponent,
	CdfMediaComponent,
	CdfVideoComponent,
	CdfMediaImageModel,
	CdfMediaVideoModel,
	CdfMediaModel	
} 										from './index';

@NgModule({
	imports:
	[
		CommonModule
	],
	declarations:
	[
		//CDF-DATA-ISLAND
		CdfDataIslandComponent,

	
		//CDF-MEDIA
		CdfImageComponent,
		CdfMediaComponent,
		CdfVideoComponent,
		CdfMediaImageModel,
		CdfMediaVideoModel,
		CdfMediaModel
	],
	exports:
	[
		//CDF-DATA-ISLAND
		CdfDataIslandComponent,
		CdfPostModel,
		CdfRequestModel,

	
		//CDF-MEDIA
		CdfImageComponent,
		CdfMediaComponent,
		CdfVideoComponent,		
		CdfMediaImageModel,
		CdfMediaVideoModel,
		CdfMediaModel
	],
	providers:
	[
		CacheService,
		CdfSettings,
		CdfDataIslandService		
	]
})
export class CdfModule {}