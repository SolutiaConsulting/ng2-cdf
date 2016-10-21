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
import { CdfVideoComponent } 			from '../video/index';

@Component({
	selector: 'cdf-media',
	templateUrl: './cdf-media.component.html'
})
export class CdfMediaComponent implements OnInit 
{
	@Input()
	media: CdfMediaModel;	

	@Output()
	onImageClick: EventEmitter<any> = new EventEmitter<any>();

	@Output()
	onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(CdfVideoComponent) videoComponent: CdfVideoComponent;

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