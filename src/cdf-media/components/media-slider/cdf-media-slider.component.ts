import
{
	Component,
	OnInit,
	Input,
	Output,
	AfterViewInit,
	EventEmitter,
	NgZone,
	ViewChild,
	QueryList,
	trigger,
	transition,
	keyframes,
	animate,
	state,
	style,

} 								from '@angular/core';
import { Observable } 			from 'rxjs/Rx';

import { CdfMediaComponent } 	from '../media/index';
import { CdfMediaModel } 		from '../../models/index';
import { SliderDirectionEnum } 	from './cdf-media-slider.enum';

@Component({
	selector: 'cdf-media-slider',
	template: `
	<!--MEDIA PANE-->
	<section class="cdf-media-pane-container" [@mediaStateTrigger]="mediaModel.mediaPaneState">
		
		<!--MEDIA: IMAGE OR VIDEO-->
		<cdf-media [media]="mediaModel"
					[showType]="showType"
					(onImageClick)="onMediaClick()"
					(onVideoBeforePlay)="onVideoBeforePlay()"></cdf-media>				

	</section>


	<!--INFO PANE-->
	<section class="cdf-info-pane-container" *ngIf="mediaModel.IsInfoPaneExpanded" [@infoPaneSlideTrigger]="mediaModel.infoPaneExpandedState">
		<section class="cdf-info-pane-container__wrapper">

			<!--CLOSE BUTTON-->
			<a class="close-button" (click)="onStopVideoClick()">×</a>

			<ng-content></ng-content>

		</section>
	</section>	
	`,
	styles: [ `
	.cdf-media-pane-container
	{
		cursor: pointer;
		margin: 0;
		max-height: 100%;
		min-height: 100%;
		padding: 0;
		z-index: 10;

		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;	
	}
		.cdf-media-pane-container__title
		{
			color: #000;
			font-size: 3.25rem;
			margin: auto;
			transform: rotate(3deg);
		}	

		.cdf-media-pane-container:nth-child(2n)
		{
			.feature-list-container__item__title
			{
				transform: rotate(-3deg);
			}							
		}			


	.cdf-info-pane-container
	{
		background-color: #fff;
		border: solid 2px #becbd2;
		bottom: 0;
		height: 100%;
		left: 0;	
		overflow: hidden;
		padding: 2.75rem 1rem 1rem 1rem;
		position: absolute;
		right: 0;
		top: 0;
		width: 100%;
		z-index: 100;
	}	

		.cdf-info-pane-container__wrapper
		{
			z-index: 0;
		}

		.cdf-info-pane-container__title
		{
			margin: 0 0 1rem 0;
		}

		.cdf-info-pane-container__date
		{
			font-size: 1rem;
			margin: 0 0 1rem 0;
		}
	` ],
	providers: [],
	animations:
	[
		trigger('mediaStateTrigger', 
			[
				//STATE WHEN VIDEO IS STOPPED AND BECOMES INACTIVE
				state(
					'inactive',
					style({
							zIndex: 10
						})
					),
				//STATE WHEN VIDEO IS PLAYING
				state(
					'active',
					style({
							zIndex: 1000
						})
					)
			]
		),
		trigger('infoPaneSlideTrigger',
			[
				state('expandToTop', 	style({ zIndex: 100, top: '-100%' })),
				state('expandToRight', 	style({ zIndex: 100, left: '100%' })),
				state('expandToBottom', style({ zIndex: 100, top: '100%' })),
				state('expandToLeft',   style({ zIndex: 100, left: '-100%' })),
				
				//EXPANDING TO TOP DIRECTION
				transition('void => expandToTop',
					[
						animate('500ms 350ms ease-in', keyframes([
							style({ top: '0', offset: 0 }),
							style({ top: '-25%', offset: 0.25 }),
							style({ top: '-50%', offset: 0.5 }),
							style({ top: '-75%', offset: 0.75 }),
							style({ top: '-100%',  offset: 1.0 })
						]))						
					]	
				),	
				transition('expandToTop => *',
					[
						animate('500ms ease-out', keyframes([
							style({ top: '-100%', offset: 0 }),
							style({ top: '-75%', offset: 0.25 }),
							style({ top: '-50%', offset: 0.5 }),
							style({ top: '-25%', offset: 0.75 }),
							style({ top: '0',  offset: 1.0 })
						]))						
					]	
				),


				//EXPANDING TO RIGHT DIRECTION
				transition('void => expandToRight',
					[
						animate('500ms 250ms ease-in', keyframes([
							style({ left: '0', offset: 0 }),
							style({ left: '25%', offset: 0.25 }),
							style({ left: '50%', offset: 0.5 }),
							style({ left: '75%', offset: 0.75 }),
							style({ left: '100%',  offset: 1.0 })
						]))						
					]	
				),	
				transition('expandToRight => *',
					[
						animate('500ms ease-out', keyframes([
							style({ left: '100%', offset: 0 }),
							style({ left: '75%', offset: 0.25 }),
							style({ left: '50%', offset: 0.5 }),
							style({ left: '25%', offset: 0.75 }),
							style({ left: '0',  offset: 1.0 })
						]))						
					]	
				),


				//EXPANDING TO BOTTOM DIRECTION
				transition('void => expandToBottom',
					[
						animate('500ms 350ms ease-in', keyframes([
							style({ top: '0', offset: 0 }),
							style({ top: '25%', offset: 0.25 }),
							style({ top: '50%', offset: 0.5 }),
							style({ top: '75%', offset: 0.75 }),
							style({ top: '100%',  offset: 1.0 })
						]))						
					]	
				),	
				transition('expandToBottom => *',
					[
						animate('500ms ease-out', keyframes([
							style({ top: '100%', offset: 0 }),
							style({ top: '75%', offset: 0.25 }),
							style({ top: '50%', offset: 0.5 }),
							style({ top: '25%', offset: 0.75 }),
							style({ top: '0',  offset: 1.0 })
						]))						
					]	
				),				

				//EXPANDING TO LEFT DIRECTION
				transition('void => expandToLeft',
					[
						animate('500ms 350ms ease-in', keyframes([
							style({ left: '0', offset: 0 }),
							style({ left: '-25%', offset: 0.25 }),
							style({ left: '-50%', offset: 0.5 }),
							style({ left: '-75%', offset: 0.75 }),
							style({ left: '-100%',  offset: 1.0 })
						]))						
					]	
				),	
				transition('expandToLeft => *',
					[
						animate('500ms ease-out', keyframes([
							style({ left: '-100%', offset: 0 }),
							style({ left: '-75%', offset: 0.25 }),
							style({ left: '-50%', offset: 0.5 }),
							style({ left: '-25%', offset: 0.75 }),
							style({ left: '0',  offset: 1.0 })
						]))						
					]	
				)
			]
		)
	]
})
export class CdfMediaSliderComponent implements OnInit, AfterViewInit
{
	@Input() mediaModel: CdfMediaModel;
	@Input() showType: boolean = false;
	@Output() onMediaSliderOpen = new EventEmitter<any>();
	@Output() onMediaSliderClose = new EventEmitter<any>();
	@ViewChild(CdfMediaComponent) mediaComponent: CdfMediaComponent;
	
	isMediaPlaying: boolean = false;

	constructor(
		private zone: NgZone)
	{
	};


	ngOnInit()
	{		
		//console.log('MEDIA SLIDER:', this.mediaModel);
	};	

	ngAfterViewInit()
	{ 	
	};	

	onMediaClick()
	{
		console.log('CDF MEDIA SLIDER CLICK:', this.mediaModel.Title);
		this.mediaModel.OnClick();
	};

	onVideoBeforePlay()
	{ 
		if (!this.isMediaPlaying)
		{
			//console.log('cdf-media-slider onVideoBeforePlay', this.mediaModel);

			this.isMediaPlaying = true;

			//LET PARENT KNOW SLIDER IS OPEN...
			this.onMediaSliderOpen.emit();

			this.mediaModel[ 'mediaPaneState' ] = 'active';
			this.mediaModel[ 'infoPaneExpandedState' ] = this.GetSliderDirection();
			this.mediaModel[ 'IsInfoPaneExpanded' ] = true;
		}
	};

	resetPanes()
	{ 
		this.mediaModel[ 'mediaPaneState' ] = 'inactive';
		this.mediaModel[ 'infoPaneExpandedState' ] = 'collapsed';
		this.mediaModel[ 'IsInfoPaneExpanded' ] = false;
		this.isMediaPlaying = false;
	};	

	onStopVideoClick()
	{ 
		this.stopPlayingVideo().subscribe(
			//SUCCESS
			data =>
			{
				this.isMediaPlaying = false;
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
	};
	
	stopPlayingVideo()
	{ 
		return Observable.create(observer => 
		{
			// console.log('mediaModel video to stop:', this.mediaModel.Title);
			// console.log('mediaComponent:', this.mediaComponent);		

			if (this.mediaComponent)
			{
				this.mediaComponent.stop();

				this.mediaModel[ 'infoPaneExpandedState' ] = 'collapsed';			
				
				//PAUSE WHILE TRIGGER ANIMATION FIRES THEN EMIT MEDIA SLIDER CLOSED...
				setTimeout(() => 
				{
					this.resetPanes();

					//LET PARENT KNOW SLIDER IS CLOSED...
					this.onMediaSliderClose.emit(this.mediaModel);
					
					observer.next();
					observer.complete();
				}, 400);
			}
			else
			{
				observer.next();
				observer.complete();
			}
		});	
	}

	private GetSliderDirection(): string
	{ 
		let sliderDirection: string = 'expandToLeft';

		switch (this.mediaModel['SliderDirection'])
		{ 
			case SliderDirectionEnum.Left:
				{ 
					sliderDirection = 'expandToLeft';
					break;
				}	
			case SliderDirectionEnum.Right:
				{ 
					sliderDirection = 'expandToRight';
					break;
				}
			case SliderDirectionEnum.Top:
				{ 
					sliderDirection = 'expandToTop';
					break;
				}									
			case SliderDirectionEnum.Bottom:
				{ 
					sliderDirection = 'expandToBottom';
					break;
				}					
		}

		return sliderDirection;
	};
}