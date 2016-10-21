import
{
	AfterViewInit,
	Component,
	EventEmitter,
	OnDestroy,
	OnInit,
	Output,
	Input
} 										from '@angular/core';

import { CdfMediaVideoModel }			from '../../models/index';

const jwPlayer = require('./assets/lib/jwplayer-7.6.1/jwplayer.js');

@Component({
	selector: 'cdf-video',
	templateUrl: './cdf-video.component.html',
	styleUrls: []
})
export class CdfVideoComponent implements OnInit, OnDestroy, AfterViewInit
{
	private videoJWPlayer: any;
	private youTubeUrl: string = 'https://www.youtube.com/watch?v=';
	
	VideoPlayerId: string;

	@Input()
	jwPlayerKey: string;

	@Input()
	videoModel: CdfMediaVideoModel;	

	@Input()
	isBackground: boolean = false;

	@Input()
	showControls: boolean = true;

	@Input()
	autoPlay: boolean = false;

	@Input()
	isMute: boolean = false;

	@Input()
	loopVideo: boolean = false;

	@Input()
	height: string = '900';

	@Output()
	onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();

	constructor()
	{
	}

	ngOnInit()
	{
		jwPlayer.key = this.jwPlayerKey;

		this.VideoPlayerId = 'jwp_' + this.guid();

		//IF VIDEO IS BACKGROUND, THEN FORCE THE FOLLOWING SETTINGS...
		if (this.isBackground)
		{ 
			this.showControls = false;
			this.autoPlay = true;
			this.isMute = true;
			this.loopVideo = true;
		}	
	}

	ngAfterViewInit()
	{ 
		this.videoJWPlayer = jwPlayer(this.VideoPlayerId);
		
		//console.log('VideoPlayerId', this.VideoPlayerId);

		//VIDEO URL
		if (this.videoModel.YouTubeId)
		{ 
			// console.log(' *********** posterImageUri:', posterImageUri);
			// console.log(' *********** playListSourceArray:', playListSourceArray);
			// console.log(' *********** mediaid *********** ', this.video.Id);

			let that = this;
			
			this.videoJWPlayer.setup
				({
					file: this.youTubeUrl + '' + this.videoModel.YouTubeId,
					image: this.videoModel.ImageUri,
					autostart: this.autoPlay,
					mediaid: this.guid(),
					height: "100%",
					width: "100%"
				});	
			
			this.videoJWPlayer.on('beforePlay', function (e) 
			{
				//console.log('videoJWPlayer beforePlay...');

				if (that.onVideoBeforePlay)
				{ 
					that.onVideoBeforePlay.emit();
				}					
			});
			
			this.videoJWPlayer.on('play', function (e) 
			{
				//console.log('videoJWPlayer play...');

				if (that.onVideoBeforePlay)
				{ 
					that.onVideoBeforePlay.emit();
				}					
			});			
		}	
	}

	ngOnDestroy() 
	{
		//console.log('Deinit - Destroyed Component', this.videoJWPlayer);
		//this.videoJWPlayer.destroy();
	}

	stop()
	{ 
		this.videoJWPlayer.stop();

		console.log('STOP DAS PLAYER...', this.videoModel.Title);
	};


	private guid() 
	{
		function s4() 
		{
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}

		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}	
}