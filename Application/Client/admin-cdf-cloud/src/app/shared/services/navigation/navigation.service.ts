import { Injectable } 					from '@angular/core';
import {
	Router,
	NavigationStart,
	NavigationExtras,
	NavigationEnd } 					from '@angular/router';

import { ConfigService } 				from '../../services/config/config.service';

@Injectable()
export class NavigationService 
{
	//CREATE ARRAY CONTAINING HISTORY OF NAVIGATION
	RouteHistory: string[] = [];
	defaultNavigationExtras: NavigationExtras;

	constructor(private router: Router)
	{
		this.router.events.subscribe((event) =>
		{
			// NavigationStart
			if (event instanceof NavigationStart) 
			{
				this.RouteHistory.push(event.url);
			}	
			
			// NavigationEnd
			if (event instanceof NavigationEnd) 
			{
				window.scrollTo(0, 0);
			}			
		});	

		let defaultNavigationExtras: NavigationExtras =
		{
			fragment: ''
		};	
	}


	HasNavigationHistory()
	{
		return (this.RouteHistory.length > 0);
	}

	//HOME PAGE	
	GoToHomePage()
	{
		this.router.navigate([ ConfigService.ROUTES.Home ], this.defaultNavigationExtras);
	}
	
	//ABOUT US PAGE	
	GoToAboutUsPage()
	{
		this.router.navigate([ ConfigService.ROUTES.AboutUs ]);
	}

	//CONTACT US PAGE	
	GoContactUsPage()
	{
		this.router.navigate([ ConfigService.ROUTES.ContactUs ]);
	}


	//404 PAGE
	GoTo404Page()
	{
		this.router.navigate([ ConfigService.ROUTES.NoPage404 ]);
	}


	//GENERIC NAVIGATION	
	GoToRoute(route: string, parameter?: any)
	{ 
		if (!parameter)
		{ 
			this.router.navigate([ route ]);
		}	
		else
		{
			this.router.navigate([ route, parameter ]);
		}		
	}
}