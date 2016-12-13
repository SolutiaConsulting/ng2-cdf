import { NgModule }							from '@angular/core';
import { CommonModule }						from '@angular/common';

import
{
	//COMPONENTS
	CdfImageComponent,
	CdfMediaComponent,
	CdfMediaSliderComponent,
	CdfVideoBackgroundComponent,
	CdfVideoYouTubeComponent


	//SERVICES
} 											from './index';

@NgModule({
	imports:
	[
		CommonModule
	],
	declarations:
	[
		//COMPONENTS
		CdfImageComponent,
		CdfMediaComponent,
		CdfMediaSliderComponent,
		CdfVideoBackgroundComponent,
		CdfVideoYouTubeComponent		
	],
	exports:
	[
		//COMPONENTS
		CdfVideoBackgroundComponent,
		CdfMediaComponent,
		CdfMediaSliderComponent
	],
	providers:
	[
	]
})
export class CdfMediaModule 
{
}