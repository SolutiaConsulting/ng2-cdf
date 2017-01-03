import { Injectable } 			from '@angular/core';
import { tokenNotExpired } 		from 'angular2-jwt';

// Avoid name not found warnings
let Auth0Lock = require('auth0-lock').default;

@Injectable()
export class AuthService
{
	// Configure Auth0
	lock = new Auth0Lock('tKXEk65dbjEOcM5BhpMhkP4aGcIX0X3Y', 'solutia.auth0.com', {});

	//Store profile object in auth class
	userProfile: Object;

	constructor()
	{
		console.log('************** AUTH SERVICE CONSTRUCTR **************');

    	// Set userProfile attribute of already saved profile
		this.userProfile = JSON.parse(localStorage.getItem('profile'));
		
		// Add callback for lock `authenticated` event
		this.lock.on("authenticated", (authResult) =>
		{
			localStorage.setItem('id_token', authResult.idToken);

			// Fetch profile information
			this.lock.getProfile(authResult.idToken, (error, profile) => 
			{
				if (error) 
				{
					// Handle error
					alert(error);
					return;
				}

				localStorage.setItem('profile', JSON.stringify(profile));
				this.userProfile = profile;				

				console.log('@@@@@@@@@@@@@@@@@  AUTH RESULTS:', authResult);				
				console.log('@@@@@@@@@@@@@@@@@  AUTHENTICATED USER PROFILE:', profile);
			});
		});		
	}

	public login()
	{
		// Call the show method to display the widget.
		this.lock.show();
	}

	public authenticated()
	{
		// Check if there's an unexpired JWT
		// This searches for an item in localStorage with key == 'id_token'
		return tokenNotExpired();
	}

	public logout()
	{
		// Remove token and profile from localStorage
		localStorage.removeItem('id_token');
		localStorage.removeItem('profile');
		this.userProfile = undefined;		
	}
}