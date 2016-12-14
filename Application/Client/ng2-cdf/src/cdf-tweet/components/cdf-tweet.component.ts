import
{
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnInit,


	trigger,
	transition,
	keyframes,
	animate,
	state,
	style	
} 								from '@angular/core';

import { CdfTweetModel }		from '../models/index';
import { CdfTweetService }		from '../services/index';

@Component({
	selector: 'cdf-tweet',
	template: 
	`
	<section class="offline" *ngIf="isOfflineVisible" [@visibilityChangedTrigger]="isOfflineVisible">
		<p>{{this.tweetModel.Text}}</p>
		<p>{{this.tweetModel.CreatedAt}}</p>		
	</section>
	<section id="tweetContainer" *ngIf="isOnlineVisible" [@visibilityChangedTrigger]="isOnlineVisible"></section>			
	`,
	styles: [ 
		`
		section.offline
		{
			border-bottom: solid 1px red;
		}
		
		` ],
	providers: [],
	animations:
	[
		trigger('visibilityChangedTrigger', 
		[
			state('true' , style({ opacity: 1 })),
			state('false', style({ opacity: 0, display:'none' })),
			transition('* => true', animate('.25s'))
			transition('* => false', animate('.75s'))
		])				
	]	
})
export class CdfTweetComponent implements OnInit, AfterViewInit
{
	private isOfflineVisible: boolean = true;
	private isOnlineVisible: boolean = false;
	private isCurrentlyOnline: boolean = false;

	@Input() tweetModel: CdfTweetModel;	

	@Input()
	set Online(isOnline: boolean) 
	{
		if (isOnline === true) 
		{
			if (!this.isCurrentlyOnline) 
			{
				this.isOnlineVisible = true;
				this.showTweetWidget();
			}
		}
		else {
			if (!this.isCurrentlyOnline) 
			{
				this.isOfflineVisible = true;
				this.isOnlineVisible = false;
			}
		}
	}	

	constructor
	(
		private element: ElementRef,
		private cdfTweetService : CdfTweetService
	)
	{
	}

	ngOnInit()
	{
	}

	ngAfterViewInit()
	{
	}

	private showTweetWidget()
	{
		let that = this;

		//MAKE SURE TWITTER WIDGET SCRIPT IS LOADED IN HEAD...
		this.cdfTweetService.LoadScript().subscribe 
		(
			//SUCCESS, WE HAVE TWITTER WIDGETS JS FILE LOADED...
			twttr =>
			{
				let nativeElement = this.element.nativeElement;
				let target = nativeElement.querySelector('section#tweetContainer');

				window['twttr'].widgets.createTweet(this.tweetModel.Id, target, {}).then
				(
					function success(embed) 
					{
						that.isOfflineVisible = false; 
						that.isOnlineVisible = true; 	
						that.isCurrentlyOnline = true;					
						//console.log('Created tweet widget: ', embed);
					} 
				).catch
				(
					function creationError(message) 
					{
						//console.log('Could not create widget: ', message);
					}
				);				
			},

			//ERROR
			err =>
			{
				console.log('****  ERROR LOADING TWITTER WIDGET', err);
			},
			
			//COMPLETE
			() =>
			{
			}			
		);
	}
}