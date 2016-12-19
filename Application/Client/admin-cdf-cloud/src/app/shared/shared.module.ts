import { NgModule } 				from '@angular/core';
import { CommonModule }  			from '@angular/common';
import
{
	FormsModule,
	ReactiveFormsModule
}         							from '@angular/forms';
import { HttpModule } 				from '@angular/http';
import { RouterModule } 			from '@angular/router';


//APPLICATION MODULES...
import { NavigationModule } 		from './components/navigation/index';


//3RD PARTY...
import { CdfModule } 				from 'ng2-cdf/lib';

@NgModule({
	imports:
	[
		//MODULES
		CommonModule,
		FormsModule,
		ReactiveFormsModule,		
		RouterModule,

		//APPLICATION MODULES
		NavigationModule,

		//3RD PARTY...
		CdfModule
	],
	declarations:
	[
		//COMPONENTS

		//DIRECTIVES
	],
	exports:
	[		
		//COMPONENTS

		//DIRECTIVES

		//MODULES
		CommonModule,
		FormsModule,
		HttpModule,
		ReactiveFormsModule,		
		RouterModule,

		//APPLICATION MODULES
		NavigationModule,

		//3RD PARTY...
		CdfModule
	]
})
export class SharedModule
{
}