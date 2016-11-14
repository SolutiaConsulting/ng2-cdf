import
{
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	QueryList,
	trigger,
	transition,
	keyframes,
	animate,
	state,
	style	
} 										from '@angular/core';

import { CdfMediaModel } 				from '../../models/index';
import { CdfImageComponent } 			from '../image/index';
import { CdfVideoYouTubeComponent } 	from '../video/index';

@Component({
	selector: 'cdf-media',
	template: `
	<!--IMAGE-->
	<cdf-image *ngIf="(media.HasImage && !media.HasVideo)" 
				[imageModel]="media" 
				(click)="doImageClick()"></cdf-image>

	<!--VIDEO-->
	<cdf-video-youtube *ngIf="(media.HasVideo)" 
				[videoModel]="media"
				(onVideoBeforePlay)="doOnVideoBeforePlay()"
				(onVideoStopPlay)="doOnVideoStopPlay()"></cdf-video-youtube>

	<div (click)="hideChildContent()" *ngIf="(showTitle)">
		<ng-content></ng-content>
	</div>

	<!--NO MEDIA ASSETS (NO IMAGE OR VIDEO)-->
	<h2 class="cdf-media-title-only" *ngIf="(!media.HasImage && !media.HasVideo)">{{media.Title}}</h2>

	<span *ngIf="(showType)" class="cdf-media-type cdf-media-type__{{media.Type | lowercase}}">{{media.Type}}</span>
	`,
	styles: [ `
	.cdf-media-type
	{
		color: #fff;
		left: 0.75rem;
		padding: 0.25rem 0.5rem;
		position: absolute;
		top: 0.75rem;	
		z-index: 100;
	}	
	` ],
	providers: []
})
export class CdfMediaComponent implements OnInit 
{
	@Input() media: CdfMediaModel;	
	@Input() showTitle: boolean = true;
	@Input() showType: boolean = false;
	@Output() onImageClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoStopPlay: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(CdfVideoYouTubeComponent) videoComponent: CdfVideoYouTubeComponent;
	@ViewChild(CdfImageComponent) imageComponent: CdfImageComponent;

	showTitleOriginal: boolean = false;

	constructor()
	{
	}

	ngOnInit()
	{
		this.showTitleOriginal = (this.showTitle) ? true : false;
	}

	doImageClick()
	{ 
		if (this.onImageClick)
		{ 
			this.onImageClick.emit();
		}			
	}

	doOnVideoBeforePlay()
	{ 
		this.showTitle = false;

		if (this.onVideoBeforePlay)
		{ 
			this.onVideoBeforePlay.emit();
		}			
	}

	doOnVideoStopPlay()
	{ 
		this.showTitle = this.showTitleOriginal;
		
		if (this.onVideoStopPlay)
		{ 
			this.onVideoStopPlay.emit();
		}			
	}

	stop()
	{		
		this.videoComponent.stop();
		//console.log('STOP DAS PLAYER...', this.media.Title);
	};		

	hideChildContent()
	{
		if(this.videoComponent)
		{
			this.videoComponent.play();			
		}

		if(this.imageComponent)
		{
			this.doImageClick();
		}
	};
}