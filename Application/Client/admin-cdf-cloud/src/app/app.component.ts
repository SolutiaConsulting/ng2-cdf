import {
    Component,
    NgZone,
    OnInit
} 								from '@angular/core';

import
{
    AuthService,
    OnlineService
}                               from './shared/services/index';

@Component
    ({
        selector: 'cdf-app',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
export class AppComponent implements OnInit
{
    constructor(
        private authService: AuthService,
        private onlineService : OnlineService
    ) 
	{
    }

    ngOnInit()
    {
        this.onlineService.IsOnlineStream.subscribe(
            //SUCCESS
            data =>
            {	
                //console.log('APP COMPONENT IS ONLINE:', data);						
            },

            //ERROR
            err =>
            { 
            },

            //COMPLETE
            () =>
            {                 
            }				
        );
    }
}
