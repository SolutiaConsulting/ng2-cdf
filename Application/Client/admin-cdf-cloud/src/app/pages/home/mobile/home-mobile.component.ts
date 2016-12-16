import { Component, OnInit, NgZone } 	from '@angular/core';
import { CdfRequestModel } 				from 'ng2-cdf/lib';

import { environment } 					from '../../../../environments/environment';

@Component({
	selector: 'dsb-home-mobile',
	templateUrl: './home-mobile.component.html',
	styleUrls: [],
	providers: []
})
export class HomeMobileComponent implements OnInit 
{
	RequestModel: CdfRequestModel;

	constructor
	(
		private zone: NgZone
	)
	{
	}

	ngOnInit() 
	{
		//console.log('home mobile init');
	}

	onContentReceived(rawJson: any) 
	{	
		if (rawJson)
		{ 			
			console.log('HOME PAGE MOBILE ON CONTENT RECEIVED:', rawJson);

			this.zone.run(() =>
			{ 	// Change the property within the zone, CD will run after

				//console.log('HOME PAGE MOBILE PAGE CONTENT:', this.PageData);
			});	
		}			
	}	
}