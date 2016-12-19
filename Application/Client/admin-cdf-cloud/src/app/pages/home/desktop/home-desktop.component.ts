import { Component, OnInit, NgZone } 	from '@angular/core';
import { Location } 					from '@angular/common';
import { CdfRequestModel } 				from 'ng2-cdf/lib';

import { environment } 					from '../../../../environments/environment';


@Component({
	selector: 'dsb-home-desktop',
	templateUrl: './home-desktop.component.html',
	styleUrls: [],
	providers: []
})
export class HomeDesktopComponent implements OnInit
{
	constructor(
		private location: Location,
		private zone: NgZone
	) 
	{
	};

	ngOnInit() 
	{
	};

	onContentReceived(rawJson: any) 
	{
		if (rawJson)
		{
			console.log('HOME PAGE DESKTOP ON CONTENT RECEIVED:', rawJson);
		
			this.zone.run(() =>
			{ 	// Change the property within the zone, CD will run after

				//console.log('HOME PAGE MOBILE PAGE CONTENT:', this.PageData);
			});	
		}
	};
}