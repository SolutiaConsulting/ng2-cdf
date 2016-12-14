import { NgModule }							from '@angular/core';
import { CommonModule }						from '@angular/common';

import
{
	//COMPONENTS
	CdfTweetComponent,


	//SERVICES
	CdfTweetService
} 											from './index';

@NgModule({
	imports:
	[
		CommonModule
	],
	declarations:
	[
		//COMPONENTS
		CdfTweetComponent
	],
	exports:
	[
		//COMPONENTS
		CdfTweetComponent

	],
	entryComponents:
	[
		CdfTweetComponent
	],
	providers:
	[
		CdfTweetService
	]
})
export class CdfTweetModule 
{
}