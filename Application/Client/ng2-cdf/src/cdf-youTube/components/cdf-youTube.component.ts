import
{
	AfterViewInit,
	Component,
	Input,
	OnInit,


	trigger,
	transition,
	keyframes,
	animate,
	state,
	style	
} 								from '@angular/core';

import { CdfYouTubeModel }		from '../models/index';
import { OnlineService }		from '../../services/index';

@Component({
	selector: 'cdf-youtube',
	template: 
	`	
	<cdf-media [mediaModel]="youTubeModel" [showTitle]="false" [showType]="false" *ngIf="isOnlineConnection" [@visibilityChangedTrigger]="isOnlineVisible"></cdf-media>
	`,
	styles: [ 
		`		
		` ],
	providers: [ OnlineService ],
	animations:
	[
		trigger('visibilityChangedTrigger', 
		[
			state('true' , style({ opacity: 1 })),
			state('false', style({ opacity: 0, display:'none' })),
			transition('* => void', animate('.5s'))
		])				
	]	
})
export class CdfYouTubeComponent implements OnInit, AfterViewInit
{
	private isOnlineConnection: boolean = false;

	@Input() youTubeModel: CdfYouTubeModel;	

	constructor
	(
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
				this.isOnlineConnection = data;				
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

	ngAfterViewInit()
	{
	}
}