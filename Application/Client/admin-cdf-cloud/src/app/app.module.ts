import { BrowserModule } 	from '@angular/platform-browser';
import { FormsModule } 		from '@angular/forms';
import { HttpModule } 		from '@angular/http';
import { NgModule } 		from '@angular/core';

// APP ROOT
import { AppComponent } 	from './app.component';
import { AppRoutingModule } from './app-routing.module';

// APPLICATION MODULES - THESE MODULES ARE LOADED WHEN APP LOADS
import { CoreModule }   	from './shared/core.module';
import { HomeModule } 		from './pages/home/home.module';

@NgModule({
	imports:
	[
		BrowserModule,
		FormsModule,
		HttpModule,

		//APPLICATION MODULES
		AppRoutingModule,
		CoreModule.forRoot(),
        HomeModule
	],
	declarations:
	[
		AppComponent
	],
	providers:
	[
		
	],
	bootstrap:
	[
		AppComponent
	]
})
export class AppModule { }