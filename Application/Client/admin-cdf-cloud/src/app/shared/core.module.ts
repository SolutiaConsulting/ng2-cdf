import
{
	NgModule,
	ModuleWithProviders
} 									from '@angular/core';
import { CommonModule }  			from '@angular/common';
import
{
	FormsModule,
	ReactiveFormsModule
}         							from '@angular/forms';
import { RouterModule } 			from '@angular/router';

import
{
	//SHARED SERVICES
	AuthService,
	BreadcrumbService,
	CompareService,
	ConfigService,
	OnlineService,
    MatchMediaService,
	NavigationService
}									from './services/index';

import { environment } 				from '../../environments/environment';

//3RD PARTY...
import { CdfModule } 				from 'ng2-cdf/lib';

//BUILD DOMAIN CONFIGURATION ARRAY NEEDED FOR CDF MODULE...
let configArray = ConfigService.GetDomainCredentials();

//console.log('++++++++ CONFIG ARRAY YO:', configArray);

@NgModule({
	imports:
	[
		//MODULES
		CommonModule,
		FormsModule,
		ReactiveFormsModule,		
		RouterModule,

		//APPLICATION MODULES

		//3RD PARTY...
		CdfModule.forRoot(configArray, environment.JW_PLAYER.key)
	],
	declarations:
	[
		//COMPONENTS

		//DIRECTIVES
	],
	exports:
	[		
	]
})
export class CoreModule
{
	static forRoot(): ModuleWithProviders
	{
		return {
			ngModule: CoreModule,
			providers:
			[ 
				AuthService,
				BreadcrumbService,
				CompareService,
				OnlineService,
				MatchMediaService,
				NavigationService
			]
		};
	}
}