import { Injectable } 		from '@angular/core';

@Injectable()
export class CdfSettings 
{	
	/*
	LIST OF CREDENTIALS BY DOMAIN NAME

	AFFORDS ABILITY TO SUPPORT MULTIPLE DOMAINS...

	**** NOTE ****
	FOR CLOUD CMS, THE API KEYS ARE AVAILABLE BY CLICKING ON API KEYS MENU ITEM FOR A GIVEN PROJECT
	CLICK ON THE 'NODE.JS' FILE LINK FOR POPUP WITH VALUES NEEDED FOR OAUTH2 CONNECTION.

	YOU WILL NEED TO ENCODE THE PASSWORD IN ORDER TO MAKE A SUCCESSFUL REQUEST (http://meyerweb.com/eric/tools/dencoder/)	
	 */
	public static DOMAIN_CREDENTIALS =
	{
		"api.cloudcms.com":
		{
			"clientKey": "00343b6a-a994-491e-ab57-3a7294166bdf",
			"clientSecret": "s86jsbvHkazh54Qgv6pW2MQnMS9Tm30W+MQWzAtK2gycRepYckOhIRc/cVOLtY0IbGLzYRgkH4Fm3JqSkwC9o4WSzqwQdV7iRH2g7zohN34=",
			"username": "b4c64ed9-7f23-40cc-b67d-9547f23fb356",
			"password": "cSSf7yfLsFkM3PzKLr3YXcsFIfal1baHWafr40f1t5OesKLfNlDvi82MWWHq2cwwpDer8QqRmQ4qBSIfk6gIF%2BkC8FGM%2FFKdwvHPlPvFeco%3D",
			"baseURL": "https://api.cloudcms.com",
			"application": "ef63bb76e43d41ebddf6"			
		}
	};
}