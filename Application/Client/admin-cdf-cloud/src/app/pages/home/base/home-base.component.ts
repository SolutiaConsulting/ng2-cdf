import {
	Component,
	OnInit,
	NgZone
} 									from '@angular/core';
import { 
	CdfRequestModel,
	CdfTweetModel,
	CdfYouTubeModel
} 									from 'ng2-cdf/lib';

import { PageHomeModel } 			from '../models/page-home.model';
import
{ 
	AuthService,
	CompareService,
	OnlineService 
} 									from '../../../shared/index';



@Component({
	selector: 'dsb-home-base',
	templateUrl: './home-base.component.html',
	styleUrls: [ './home-base.component.scss'],
	providers: []
})
export class HomeBaseComponent implements OnInit
{
	IsOnline: boolean = true;
	RequestModel: CdfRequestModel;
	PageData: PageHomeModel;
	
	constructor(
		private authService: AuthService,
		private zone: NgZone,
		private compareService: CompareService,
		private onlineService : OnlineService
	)
	{	
	}

	ngOnInit()
	{		
		let that = this;

		this.RequestModel = new CdfRequestModel();
		
		//LIST OF GETS FOR DATA ISLAND		
		// this.RequestModel.GetList =
		// 	[
		// 		'https://api.twitter.com/1.1/statuses/user_timeline.json?count=20&screen_name=dfwsportsbeat',
		// 		'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCdNXQTnqhsnOa16lhbuvJ5w&order=date&maxResults=8'
		// 	];
	}

	onContentReceived(rawJson: any) 
	{
		if (rawJson)
		{ 		
   			//console.log('%%%%%%%%%%%%%%% HOME PAGE - RAW JSON RECEIVED:', rawJson);
	
			this.zone.run(() =>
			{ 	// Change the property within the zone, CD will run after
				
				//this.PageData = new PageHomeModel(rawJson[0], rawJson[1]);

				//console.log('%%%%%%%%%%%%%%% HOME PAGE - PAGE DATA', this.PageData);
			});	
		}
	};

	onContentError(message: MessageEvent) 
	{
		console.log('CONTENT RECEIVED ERROR:', message);
	};  
}