import { NgModule }							from '@angular/core';
import { CommonModule }						from '@angular/common';
import
{
	FormsModule,
	ReactiveFormsModule
}         									from '@angular/forms';

import
{
	//COMPONENTS
	CdfContactUsFormComponent
} 											from './index';

import
{
	//DIRECTIVES
	FloatLabelDirective
} 											from '../directives/index';

@NgModule({
	imports:
	[
		CommonModule,
		FormsModule,
		ReactiveFormsModule		
	],
	declarations:
	[
		//COMPONENTS
		CdfContactUsFormComponent,

		//DIRECTIVES
		FloatLabelDirective		
	],
	exports:
	[
		//COMPONENTS
		CdfContactUsFormComponent
	],
	entryComponents:
	[
		CdfContactUsFormComponent
	],
	providers:
	[		
	]
})
export class CdfContactUsFormModule 
{
}