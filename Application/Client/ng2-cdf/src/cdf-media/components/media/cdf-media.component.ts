import
{
	animate,
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	HostBinding,
	keyframes,
	QueryList,
	state,
	style,
	trigger,
	transition,
	ViewChild
} 										from '@angular/core';

import { CdfMediaModel } 				from '../../models/index';
import { CdfImageComponent } 			from '../image/index';
import { CdfVideoYouTubeComponent } 	from '../video/index';

@Component({
	selector: 'cdf-media',
	template: `
	<!--IMAGE-->
	<cdf-image *ngIf="(mediaModel.HasImage && !mediaModel.HasVideo)" 
				[imageModel]="mediaModel" 
				(click)="doImageClick()"></cdf-image>

	<!--VIDEO-->
	<cdf-video-youtube *ngIf="(mediaModel.HasVideo)" 
				[mediaModel]="mediaModel"
				(onVideoBeforePlay)="doOnVideoBeforePlay()"
				(onVideoStopPlay)="doOnVideoStopPlay()"></cdf-video-youtube>

	<div (click)="onMediaClick()">
		<ng-content></ng-content>
	</div>

	<!--NO MEDIA ASSETS (NO IMAGE OR VIDEO)-->
	<h2 *ngIf="(!mediaModel.HasImage && !mediaModel.HasVideo) || (showTitle)" class="cdf-media-title" (click)="onMediaClick()">{{mediaModel.Title}}</h2>

	<span *ngIf="(showType && mediaModel.Type && mediaModel.Type.length > 0)" class="cdf-media-type cdf-media-type-{{getCleanType()}}">{{mediaModel.Type}}</span>
	`,
	styles: [ `
	:host 
	{
		display: inherit;
		height: 200px;
		width: 200px;
	}

	.cdf-media-title
	{
		height: 100%;
		line-height: 9;
		margin: auto;		
		text-align: center;
		vertical-align: middle;
		width: 100%;
	}	

	.cdf-media-type
	{
		background-color: #ccc;
		color: #fff;
		left: 0.75rem;
		padding: 0.25rem 0.5rem;
		position: absolute;
		top: 0.75rem;	
		z-index: 100;
	}	
	` ],
	host: 
	{
		'[class]' : 'classNames' 
	},
	providers: []
})
export class CdfMediaComponent implements OnInit
{
	@Input() mediaModel: CdfMediaModel;	
	@Input() showTitle: boolean = false;
	@Input() showType: boolean = false;
	@Output() onImageClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoStopPlay: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(CdfVideoYouTubeComponent) videoComponent: CdfVideoYouTubeComponent;
	@ViewChild(CdfImageComponent) imageComponent: CdfImageComponent;

	@HostBinding('class.media-is-video') IsMediaVideo: boolean = false;
	@HostBinding('class.media-is-image') IsMediaImage: boolean = false;

	showTitleOriginal: boolean = false;
	classNames: string;

	constructor()
	{
	}

	ngOnInit()
	{
		this.showTitleOriginal = (this.showTitle) ? true : false;

		this.IsMediaVideo = this.mediaModel.HasVideo;
		this.IsMediaImage = (this.mediaModel.HasImage && !this.mediaModel.HasVideo);
		this.classNames = (this.mediaModel.Type && this.mediaModel.Type.length > 0) ? 'type-' +  this.getCleanType() : 'type-not-supplied';
	};

	doOnVideoBeforePlay()
	{ 
		this.showTitle = false;

		if (this.onVideoBeforePlay)
		{ 
			this.onVideoBeforePlay.emit(this.mediaModel);
		}			
	};

	doOnVideoStopPlay()
	{ 
		this.showTitle = this.showTitleOriginal;
		
		if (this.onVideoStopPlay)
		{ 
			this.onVideoStopPlay.emit(this.mediaModel);
		}			
	};

	stop()
	{		
		this.videoComponent.stop();
		//console.log('STOP DAS PLAYER...', this.mediaModel.Title);
	};		

	onMediaClick()
	{
		if(this.videoComponent)
		{
			this.videoComponent.play();			
		}

		if(this.imageComponent)
		{
			this.doImageClick();
		}

		if(!this.imageComponent && !this.videoComponent)
		{
			this.doImageClick();
		}
	};


	private doImageClick()
	{ 
		if (this.onImageClick)
		{ 
			this.onImageClick.emit(this.mediaModel);
		}			
	}	;

	private getCleanType()
	{
		return this.mediaModel.Type.replace(/ /g,'').toLowerCase();
	};
}