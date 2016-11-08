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

	<div (click)="hideChildContent()" *ngIf="isTitleVisible">
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
	@Input() showType: boolean = false;
	@Output() onImageClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoStopPlay: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(CdfVideoYouTubeComponent) videoComponent: CdfVideoYouTubeComponent;
	@ViewChild(CdfImageComponent) imageComponent: CdfImageComponent;

	isTitleVisible: boolean = true;

	constructor()
	{
	}

	ngOnInit()
	{
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
		if (this.onVideoBeforePlay)
		{ 
			this.onVideoBeforePlay.emit();
		}			
	}

	doOnVideoStopPlay()
	{ 
		if (this.onVideoStopPlay)
		{ 
			this.isTitleVisible = true;
			this.onVideoStopPlay.emit();
		}			
	}

	stop()
	{ 
		this.isTitleVisible = true;
		this.videoComponent.stop();
		//console.log('STOP DAS PLAYER...', this.media.Title);
	};		

	hideChildContent()
	{
		if(this.videoComponent)
		{
			this.isTitleVisible = false;
			this.videoComponent.play();			
		}

		if(this.imageComponent)
		{
			this.doImageClick();
		}
	};
}