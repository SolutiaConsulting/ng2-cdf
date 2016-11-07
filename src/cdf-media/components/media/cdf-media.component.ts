import
{
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	QueryList	
} 										from '@angular/core';

import { CdfMediaModel } 				from '../../models/index';
import { CdfVideoYouTubeComponent } 	from '../video/index';

@Component({
	selector: 'cdf-media',
	template: `
	<!--IMAGE-->
	<cdf-image *ngIf="(media.HasImage && !media.HasVideo)" 
				[imageModel]="media" 
				(click)="doImageClick()">
	</cdf-image>


	<!--VIDEO-->
	<cdf-video-youtube *ngIf="(media.HasVideo)" 
				[videoModel]="media"
				(onVideoBeforePlay)="doVideoBeforePlay()">
	</cdf-video-youtube>


	<!--NO MEDIA ASSETS (NO IMAGE OR VIDEO)-->
	<h2 class="cdf-media-title-only" *ngIf="(!media.HasImage && !media.HasVideo)">{{media.Title}}</h2>

	<span *ngIf="(showType)" class="cdf-media-type cdf-media-type__{{media.Type | lowercase}}">{{media.Type}}</span>

	<ng-content></ng-content>	
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
})
export class CdfMediaComponent implements OnInit 
{
	@Input() media: CdfMediaModel;	
	@Input() showType: boolean = false;
	@Output() onImageClick: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(CdfVideoYouTubeComponent) videoComponent: CdfVideoYouTubeComponent;

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

	doVideoBeforePlay()
	{ 
		if (this.onVideoBeforePlay)
		{ 
			this.onVideoBeforePlay.emit();
		}			
	}

	stop()
	{ 
		this.videoComponent.stop();
		//console.log('STOP DAS PLAYER...', this.media.Title);
	};		
}