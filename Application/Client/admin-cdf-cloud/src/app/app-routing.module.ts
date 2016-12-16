import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

export const routes: Routes =
	[
		{ path: '', redirectTo: '/home', pathMatch: 'full' },
		{ path: 'home', component: HomeComponent },

		//LAZY LOADED:
		// { path: 'about-us', 			loadChildren: 'app/pages/about-us/about-us.module#AboutUsModule' },
		// { path: 'contact-us', 			loadChildren: 'app/pages/contact-us/contact-us.module#ContactUsModule' },

		//404 ROUTE
		//{ path: '**', component: Four04Component }
	];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule { }