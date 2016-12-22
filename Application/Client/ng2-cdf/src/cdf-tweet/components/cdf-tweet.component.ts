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
import { Observable } 			from 'rxjs/Rx';

import { CdfTweetModel }		from '../models/index';
import { CdfTweetService }		from '../services/index';

@Component({
	selector: 'cdf-tweet',
	template: 
	`
	<section class="offline" *ngIf="isOfflineState" [@visibilityChangedTrigger]="isOfflineState">
		<p class="text">{{this.tweetModel.Text}}</p>
		<p class="timestamp">{{this.tweetModel.CreatedAt | date:'medium'}}</p>		
	</section>
	<section id="tweetContainer" *ngIf="isOnlineState" [@visibilityChangedTrigger]="isOnlineState"></section>			
	`,
	styles: [ 
		`
		section.offline
		{
			background-color: #fff;
			border: solid 1px rgb(225, 232, 237);
			margin: 0.5rem 0;
			padding: 20px 20px 11.6px;
			border-radius: 0.325rem;			
		}

		p.text
		{
			line-height: 1.6;
			text-rendering: optimizeLegibility;
			color: rgb(28, 32, 34);
			font: 16px/1.4 Helvetica, Roboto, "Segoe UI", Calibri, sans-serif;
		}

		p.timestamp
		{
			color: rgb(105, 120, 130);
			font-size: 12.25px;
		}		
		
		` ],
	providers: [],
	animations:
	[
		trigger('visibilityChangedTrigger', 
		[
			state('true' , style({ opacity: 1 })),
			state('false', style({ opacity: 0, display:'none' })),
			transition('* => true', animate('.25s')),
			transition('* => false', animate('.75s'))
		])				
	]	
})
export class CdfTweetComponent implements OnInit, AfterViewInit
{
	private isOfflineState: boolean = true;
	private isOnlineState: boolean = true;

	@Input() tweetModel: CdfTweetModel;	

	constructor
	(
		private element: ElementRef,
		private cdfTweetService : CdfTweetService
	)
	{
	}

	ngOnInit()
	{
		//NOW ATTEMPT TO RENDER WIDGET
		this.renderTweetWidget().subscribe
		(							
			data =>
			{
				this.isOfflineState = false; 
				this.isOnlineState = true; 	
			},

			//ERROR
			err =>
			{ 
				this.isOfflineState = true; 
				this.isOnlineState = false; 
			},

			//COMPLETE
			() =>
			{                 
			}	
		);		
	}

	ngAfterViewInit()
	{
	}

	private renderTweetWidget(): Observable<any>
	{
		return Observable.create(observer => 
		{
			//MAKE SURE TWITTER WIDGET SCRIPT IS LOADED IN HEAD...
			this.cdfTweetService.LoadScript().subscribe 
			(
				//SUCCESS, WE HAVE TWITTER WIDGET JS FILE LOADED...
				data =>
				{
					let nativeElement = this.element.nativeElement;
					let target = nativeElement.querySelector('section#tweetContainer');

					window['twttr'].widgets.createTweet(this.tweetModel.Id, target, {}).then
					(
						//WE HAVE SUCCESSFULLY EMBEDDED TWITTER TWEET INTO UI...
						function success(embed) 
						{
							if (embed)
							{ 
								//console.log('Created tweet widget: ', embed);
								observer.next();
								observer.complete();
							}    
							else
							{
								observer.error('Embed object not defined');
							}
						} 
					).catch
					(
						function creationError(message) 
						{
							//console.log('Could not create widget: ', message);
							observer.error(message);
						}
					);				
				},

				//ERROR
				err =>
				{
					//console.log('****  ERROR LOADING TWITTER WIDGET', err);
					observer.error(err);					
				},
				
				//COMPLETE
				() =>
				{
				}			
			);
		});
	}
}