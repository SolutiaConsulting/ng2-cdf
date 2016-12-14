import { NgModule }							from '@angular/core';
import { CommonModule }						from '@angular/common';

import
{
	//COMPONENTS
	CdfYouTubeComponent,


	//SERVICES

} 											from './index';

import { CdfMediaModule }					from '../cdf-media/index';

@NgModule({
	imports:
	[
		CommonModule,

		CdfMediaModule
	],
	declarations:
	[
		//COMPONENTS
		CdfYouTubeComponent
	],
	exports:
	[
		//COMPONENTS
		CdfYouTubeComponent

	],
	entryComponents:
	[
		CdfYouTubeComponent
	],
	providers:
	[		
	]
})
export class CdfYouTubeModule 
{
}