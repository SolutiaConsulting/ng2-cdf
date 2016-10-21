import { NgModule }						from '@angular/core';
import { CommonModule }					from '@angular/common';

import
{
	//CDF-DATA-ISLAND
	CacheService,
	CdfSettings,
	DataIslandComponent,
	DataIslandService,

	
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
		DataIslandComponent,

	
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
		DataIslandComponent,

	
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
		DataIslandService		
	]
})
export class CdfModule {}