import
{
	AfterViewInit,
	Component,
	EventEmitter,
	OnInit,
	Output,
	Input
} 										from '@angular/core';

import { CdfMediaModel }				from '../../models/index';
import { CdfVideoSettingsService }		from './cdf-video-settings.service';

const jwPlayer = require('ng2-cdf/src/assets/lib/jwplayer-7.6.1/jwplayer.js');

@Component({
	selector: 'cdf-video-youtube',
	template: `
	<div [id]="VideoPlayerId"></div>
	<ng-content></ng-content>	
	`,
	styles: [ `
	:host /deep/ .jw-error .jw-preview, 
	:host /deep/ .jw-stretch-uniform .jw-preview, 
	:host /deep/ .jwplayer .jw-preview,
	:host /deep/ .jw-preview
	{
		background-position: top center !important;
		background-size: cover !important;
	}	
	`]
})
export class CdfVideoYouTubeComponent implements OnInit, AfterViewInit
{
	private videoJWPlayer: any;
	private jwPlayerKey: string;
	private youTubeUrl: string = 'http://www.youtube.com/watch?v=';
	
	VideoPlayerId: string;

	@Input() videoModel: CdfMediaModel;	
	@Input() isBackground: boolean = false;
	@Input() showControls: boolean = true;
	@Input() autoPlay: boolean = false;
	@Input() isMute: boolean = false;
	@Input() loopVideo: boolean = false;

	@Output() onVideoBeforePlay: EventEmitter<any> = new EventEmitter<any>();
	@Output() onVideoStopPlay: EventEmitter<any> = new EventEmitter<any>();

	constructor(
		private cdfVideoSettingsService: CdfVideoSettingsService
	)
	{
		this.jwPlayerKey = cdfVideoSettingsService.JwPlayerKey;
	}

	ngOnInit()
	{
		window["jwplayer"] = jwPlayer;
		jwPlayer.key = this.jwPlayerKey;

		//console.log('****************** IS BACKGROUND: ', this.isBackground);

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
			//console.log(' *********** videoModel.ImageUri:', this.videoModel.ImageUri);

			let that = this;
			let videoUri = this.youTubeUrl + '' + this.videoModel.YouTubeId

			this.videoJWPlayer.setup
				({
					file: videoUri,
					image: this.videoModel.ImageUri,
					controls: this.showControls,
					autostart: this.autoPlay,
					mute: this.isMute,
					repeat: this.loopVideo,
					mediaid: this.guid(),
					stretching: "fill",
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
			
			this.videoJWPlayer.on('pause', function (e) 
			{
				console.log('videoJWPlayer pause...');

				if (that.onVideoStopPlay)
				{ 
					that.onVideoStopPlay.emit();
				}					
			});

			this.videoJWPlayer.on('beforeComplete', function (e) 
			{
				console.log('videoJWPlayer stop...');

				if (that.onVideoStopPlay)
				{ 
					that.onVideoStopPlay.emit();
				}					
			});						
		}	
	}

	play()
	{ 
		if(this.videoJWPlayer)
		{
			this.videoJWPlayer.play();
			//console.log('PLAY DAS PLAYER...', this.videoModel.Title);
		}		
	};

	stop()
	{ 
		if(this.videoJWPlayer)
		{
			//console.log('STOP DAS PLAYER...', this.videoModel.Title);
			
			this.videoJWPlayer.stop();

            if (this.onVideoStopPlay)
            { 
                this.onVideoStopPlay.emit();
            }			
		}
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