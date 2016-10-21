import
{
	Component,
	OnInit,
	AfterViewInit,
	Input,
	NgZone,
	ViewChildren,
	QueryList,
	trigger,
	transition,
	keyframes,
	animate,
	state,
	style,

} 								from '@angular/core';
import { Observable } 			from 'rxjs/Rx';

//import { MatchMediaService } 	from '../../services/utilities/match-media.service';
import { CdfMediaModel } 		from '../../models/index';
import { CdfMediaComponent } 	from '../media/index';

@Component({
	selector: 'cdf-media-slider',
	templateUrl: './cdf-media-slider.component.html',
	styleUrls: [ './cdf-media-slider.component.less' ],
	providers: [],
	animations:
	[
		trigger('mediaStateTrigger', 
			[
				//STATE WHEN VIDEO IS STOPPED AND BECOMES INACTIVE
				state(
					'inactive',
					style({
							opacity: 0.25
							//transform: 'scale(1) translateX(0)'
						})
					),
				//STATE WHEN VIDEO IS PLAYING
				state(
					'active',
					style({
							opacity: 1
							//transform: 'scale(1.25) translateX(100px)',
							//zIndex: 10000
						})
					),	
				//STATE WHEN ALL VIDEOS ARE STOPPED
				state(
					'none',
					style({
							opacity: 1
						})
					),	
				transition('* => inactive',
					[
						style({
							//transform: 'translateX(80px)'
						}),							
						animate('500ms ease-out')
					]),
				transition('* => active',
					[
						style({
							//transform: 'translateX(40px)'
						}),						
						animate('500ms ease-in')
					]),
				transition('inactive => none, active => none',
					[
						style({
							//transform: 'translateX(80px)'
						}),							
						animate('500ms 100ms ease-out')
					])				
			]
		),
		trigger('panelWidthTrigger',
			[
				state('expanded', style({ opacity: 1 })),
				state('expandedNoRemainder', style({ opacity: 1 })),
				state('collapsed', style({ opacity: 0 })),
				transition('void => expanded',
					[
						animate('800ms ease-in', keyframes([
							style({ opacity: 0, transform: 'translateX(-150px)', offset: 0 }),
							style({opacity: 0.5, transform: 'translateX(-80px)', offset: 0.25}),
							style({opacity: 0.8, transform: 'translateX(-15px)', offset: 0.7}),
							style({opacity: 1, transform: 'translateX(0)',  offset: 1.0})
						]))						
					]	
				),
				transition('void => expandedNoRemainder',
					[
						animate('800ms ease-in', keyframes([
							style({ opacity: 0, transform: 'translateX(150px)', offset: 0 }),
							style({opacity: 0.5, transform: 'translateX(80px)', offset: 0.25}),
							style({opacity: 0.8, transform: 'translateX(15px)', offset: 0.7}),
							style({opacity: 1, transform: 'translateX(0)',  offset: 1.0})
						]))						
					]	
				),				
				transition('expanded => collapsed',
					[
						animate('600ms ease-out', keyframes([
							style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
							style({opacity: 0.8, transform: 'translateX(-15px)', offset: 0.25}),
							style({opacity: 0.5, transform: 'translateX(-80px)', offset: 0.7}),
							style({opacity: 0, transform: 'translateX(-150px)',  offset: 1.0})
						]))
					]
				),				
				transition('expandedNoRemainder => collapsed',
					[
						animate('600ms ease-out', keyframes([
							style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
							style({opacity: 0.8, transform: 'translateX(15px)', offset: 0.25}),
							style({opacity: 0.5, transform: 'translateX(80px)', offset: 0.7}),
							style({opacity: 0, transform: 'translateX(150px)',  offset: 1.0})
						]))
					]
				)				
			]
		)

	]
})
export class CdfMediaGridComponent implements OnInit, AfterViewInit 
{
	rules =
	{
		//27.9375rem = 447px
		singleColumn: 'only screen and (max-width : 27.9375rem)',

		//28rem = 448px		40rem = 640px
		twoColumn: 'only screen and (min-width : 28rem) and (max-width : 40rem)',

		//40.0625rem = 641px
		threeColumn: 'only screen and (min-width : 40.0625rem)'
	};

	@Input()
	mediaList: CdfMediaModel[] = [];

	@Input()
	showType: boolean = false;

	activeMediaModel: CdfMediaModel;	
	isVideoPlaying: boolean = false;	
	isOneColumn: boolean = false;
	isTwoColumns: boolean = false;
	isThreeColumns: boolean = true;

	@ViewChildren(CdfMediaComponent) mediaComponentsList: QueryList<CdfMediaComponent>;

	constructor(
		//private matchMediaService: MatchMediaService,
		private zone: NgZone)
	{
	};


	ngOnInit()
	{
		// this.isOneColumn = this.matchMediaService.IsCustomMatch(this.rules.singleColumn);
		// this.isTwoColumns = this.matchMediaService.IsCustomMatch(this.rules.twoColumn);
		// this.isThreeColumns = this.matchMediaService.IsCustomMatch(this.rules.threeColumn);

		let that = this;

		// this.matchMediaService.OnCustomMatch(this.rules.singleColumn, function (mql: MediaQueryList)
		// {
		// 	//console.log('is singleColumn', mql.matches);

		// 	if (mql.matches)
		// 	{
		// 		that.zone.run(() =>
		// 		{ // Change the property within the zone, CD will run after
		// 			that.isOneColumn = true;
		// 			that.isTwoColumns = false;
		// 			that.isThreeColumns = false;
		// 		});
		// 	}
		// });

		// this.matchMediaService.OnCustomMatch(this.rules.twoColumn, function (mql: MediaQueryList)
		// {
		// 	//console.log('is twoColumn', mql.matches);

		// 	if (mql.matches)
		// 	{
		// 		that.zone.run(() =>
		// 		{ // Change the property within the zone, CD will run after
		// 			that.isOneColumn = false;
		// 			that.isTwoColumns = true;
		// 			that.isThreeColumns = false;
		// 		});
		// 	}
		// });

		// this.matchMediaService.OnCustomMatch(this.rules.threeColumn, function (mql: MediaQueryList)
		// {
		// 	//console.log('is three column', mql.matches);

		// 	if (mql.matches)
		// 	{
		// 		that.zone.run(() =>
		// 		{ // Change the property within the zone, CD will run after
		// 			that.isOneColumn = false;
		// 			that.isTwoColumns = false;
		// 			that.isThreeColumns = true;
		// 		});
		// 	}
		// });

		for (var mediaIndex in this.mediaList)
		{
			this.mediaList[ mediaIndex ][ 'InfoClass' ] = 'order-1';
			this.mediaList[ mediaIndex ][ 'MediaClass' ] = 'order-1';			
		}		
	};	

	ngAfterViewInit()
	{ 	
	};

	onMediaClick(item: CdfMediaModel)
	{
		item.OnClick();
	};

	onVideoBeforePlay(index:number, mediaModel:CdfMediaModel)
	{ 
		if (!this.isVideoPlaying)
		{
			this.isVideoPlaying = true;
			this.activeMediaModel = mediaModel;

			this.prepareAllPanesForVideoPlay();

			let remainder = this.getRemainder(index);

			// console.log('remainder', remainder);
			// console.log('index', index);
			// console.log('mediaModel', mediaModel);			
			
			//infoPanelExpandedState depends on if mediaModel is last one in row
			mediaModel[ 'infoPanelExpandedState' ] = (remainder === 0) ? 'expandedNoRemainder' : 'expanded';
			mediaModel[ 'mediaPaneState' ] = 'active';
			mediaModel[ 'IsInfoPaneExpanded' ] = true;
			
			//IF INTERACTING WITH LAST ELEMENT IN ROW, THEN MANIPULATE SO INFO AND VIDEO PANES ARE TOGETHER
			if (remainder === 0)
			{
				let previousIndex = index - 1;

				//HIDE PREVIOUS VIDEO PANE SO VIDEO PANE AND INFO PANE OF LAST ITEM IN ROW ARE TOGETHER
				this.mediaList[ previousIndex ][ 'IsMediaPaneHidden' ] = true;
							
				/*
				IF INTERACTING WITH LAST ITEM IN ROW, THEN SWAP IT
				WITH INFO PANE (order-2).  EVERYTHING AFTER LAST ITEM IN ROW
				ORDER IS CHANGED TO A HIGHER ORDER (order-3) SO THEY
				STAY IN THE SAME ORDER.

				EVERYTHING BEFORE LAST ITEM IN ROW REMAINS SAME (order-1)
				*/
				for (var mediaIndex in this.mediaList)
				{
					if (parseInt(mediaIndex) < index)
					{
						this.mediaList[ mediaIndex ][ 'InfoClass' ] = 'order-1';
						this.mediaList[ mediaIndex ][ 'MediaClass' ] = 'order-1';
					}
					else if (parseInt(mediaIndex) === index)
					{
						this.mediaList[ mediaIndex ][ 'InfoClass' ] = 'order-1';
						this.mediaList[ mediaIndex ][ 'MediaClass' ] = 'order-2';
					}
					else if (parseInt(mediaIndex) > index)
					{
						this.mediaList[ mediaIndex ][ 'InfoClass' ] = 'order-3';
						this.mediaList[ mediaIndex ][ 'MediaClass' ] = 'order-3';
					}
				}
			}
		}
		else
		{ 
			if (mediaModel.YouTubeId != this.activeMediaModel.YouTubeId)
			{
				//console.log('A VIDEO IS CURRENTLY PLAYING:', mediaModel.Title);

				this.doStopPlayingVideo(this.activeMediaModel).subscribe(
					//SUCCESS
					data =>
					{
						//START PLAYING THE NEW ONE...
						this.onVideoBeforePlay(index, mediaModel);
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
	};

	onStopVideoCLick(mediaModel:CdfMediaModel)
	{ 
		this.doStopPlayingVideo(mediaModel).subscribe(
			//SUCCESS
			data =>
			{
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

	prepareAllPanesForVideoPlay()
	{ 
		for (var mediaIndex in this.mediaList)
		{
			this.mediaList[ mediaIndex ][ 'mediaPaneState' ] = 'inactive';

			this.mediaList[ mediaIndex ][ 'IsInfoPaneExpanded' ] = false;
			this.mediaList[ mediaIndex ][ 'IsMediaPaneHidden' ] = false;

			this.mediaList[ mediaIndex ][ 'InfoClass' ] = 'order-1';
			this.mediaList[ mediaIndex ][ 'MediaClass' ] = 'order-1';			
		}
	};

	resetAllPanes()
	{ 
		for (var mediaIndex in this.mediaList)
		{
			this.mediaList[ mediaIndex ][ 'infoPanelExpandedState' ] = 'collapsed';
			this.mediaList[ mediaIndex ][ 'mediaPaneState' ] = 'none';

			this.mediaList[ mediaIndex ][ 'IsInfoPaneExpanded' ] = false;
			this.mediaList[ mediaIndex ][ 'IsMediaPaneHidden' ] = false;

			this.mediaList[ mediaIndex ][ 'InfoClass' ] = 'order-1';
			this.mediaList[ mediaIndex ][ 'MediaClass' ] = 'order-1';			
		}
	};	

	private getRemainder(index:number) : number
	{ 
		let columnCount: number =
			(this.isOneColumn) ? 1
				: (this.isTwoColumns) ? 2
					: 3;

		let remainder = (index + 1) % columnCount;
		
		return remainder;
	}

	private doStopPlayingVideo(mediaModel:CdfMediaModel)
	{ 
		return Observable.create(observer => 
		{
			this.isVideoPlaying = false;
			this.activeMediaModel = undefined;

			let youTubeId = mediaModel.YouTubeId;
			let mediaComponent: CdfMediaComponent;
			let mediaComponentArray = this.mediaComponentsList.toArray();

			//console.log('mediaComponentArray:', mediaComponentArray);		

			for (var componentIndex in mediaComponentArray)
			{
				if (mediaComponentArray[ componentIndex ].media.YouTubeId === youTubeId)
				{
					mediaComponent = mediaComponentArray[ componentIndex ];
					break;
				}
			}

			// console.log('mediaModel video to stop:', mediaModel.Title);
			// console.log('iterative mediaComponent:', mediaComponent);

			if (mediaComponent)
			{
				mediaComponent.stop();

				mediaModel[ 'infoPanelExpandedState' ] = 'collapsed';
				mediaModel[ 'mediaPaneState' ] = 'inactive';
			
				setTimeout(() => 
				{
					mediaModel[ 'IsVideoPlaying' ] = false;
					this.resetAllPanes();

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
}