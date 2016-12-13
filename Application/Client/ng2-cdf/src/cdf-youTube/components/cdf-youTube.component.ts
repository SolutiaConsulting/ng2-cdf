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

import { CdfYouTubeModel }		from '../models/index';

@Component({
	selector: 'cdf-youtube',
	template: 
	`	
	<cdf-media [media]="youTubeModel" [showTitle]="false" [showType]="false" *ngIf="isOnlineConnection" [@visibilityChangedTrigger]="isOnlineVisible"></cdf-media>
	`,
	styles: [ 
		`		
		` ],
	providers: [],
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

	@Input()
	set Online(isOnline: boolean) 
	{
		this.isOnlineConnection = isOnline;
	}	

	constructor
	(
		private element: ElementRef
	)
	{
	}

	ngOnInit()
	{
	}

	ngAfterViewInit()
	{
	}
}