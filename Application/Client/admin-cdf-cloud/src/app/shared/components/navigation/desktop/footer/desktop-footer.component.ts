import { Router } 						from '@angular/router';
import
{
	Component,
	OnInit,
	NgZone
} 										from '@angular/core';
import { CdfRequestModel } 				from 'ng2-cdf/lib';

import { environment } 					from '../../../../../../environments/environment';

@Component({
	selector: 'dsb-desktop-footer',
	templateUrl: './desktop-footer.component.html',
	styleUrls: [ './desktop-footer.component.scss' ],
	providers: []
})
export class DesktopFooterComponent implements OnInit 
{	
	RequestModel: CdfRequestModel;
	SiteNameAndVersion: string;
	
	constructor(
		private zone: NgZone
	)
	{
	};

	ngOnInit()
	{	
		this.SiteNameAndVersion = environment.name + ' - ' + environment.version;
	};

	onContentReceived(rawJson: any) 
	{
		if (rawJson)
		{
			//console.log('DESKTOP FOOTER ON CONTENT RECEIVED:', rawJson);

			this.zone.run(() =>
			{ 	// Change the property within the zone, CD will run after
			});	
		}		
	}	
}