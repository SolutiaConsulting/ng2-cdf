import { NgModule }					from '@angular/core';
import { BrowserModule } 			from '@angular/platform-browser';

import { HomeBaseComponent }		from './base/home-base.component';
import { HomeDesktopComponent }		from './desktop/home-desktop.component';
import { HomeMobileComponent }		from './mobile/home-mobile.component';
import { HomeComponent }			from './home.component';
import { routing }					from './home.routing';

import { SharedModule }   			from '../../shared/shared.module';

@NgModule({
	imports:
	[
		BrowserModule,
		routing,
		SharedModule
	],
	declarations:
	[
		HomeBaseComponent,
		HomeDesktopComponent,
		HomeMobileComponent,
		HomeComponent
	],
	exports:
	[
		HomeComponent
	],
	providers:
	[
	]
})
export class HomeModule {}