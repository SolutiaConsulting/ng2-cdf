import
{
	AfterViewInit,
	Component,
	EventEmitter,
	OnInit,
	Output,
	Input
} 									from '@angular/core';

import { CdfMediaModel }			from '../../models/index';
import { ClientConfigService }		from '../../../services/client-config.service';

const jwPlayer = require('ng2-cdf/src/assets/lib/jwplayer-7.6.1/jwplayer.js');

@Component({
	selector: 'cdf-video-background',
	template: `
	<div [id]="videoPlayerId"></div>
	<ng-content></ng-content>	
	`,
	styles: [ `
	:host 
	{
		height: 200px;
	}

	:host /deep/ .jwplayer
	{
		height: inherit !important;
	}

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
export class CdfVideoBackgroundComponent implements OnInit, AfterViewInit
{
	private videoJWPlayer: any;
	private jwPlayerKey: string;
	private videoPlayerId: string;

	@Input() media: CdfMediaModel;

	constructor()
	{
		this.jwPlayerKey = ClientConfigService.GetJwPlayerKey();
	};

	ngOnInit()
	{
		window["jwplayer"] = jwPlayer;
		jwPlayer.key = this.jwPlayerKey;

		this.videoPlayerId = 'jwp_' + this.guid();
	};

	ngAfterViewInit()
	{ 
		this.videoJWPlayer = jwPlayer(this.videoPlayerId);
		
		//console.log('Video Model', this.media);

		//VIDEO URL
		if (this.media.HasVideo)
		{
			let playListSourceArray: Object[] = [];

			//add video from array of types to play list			
			for (var item of this.media.VideoList) 
			{
				playListSourceArray.push(
					{
						mediaid: item.VideoId,
						file: item.VideoUri,
						label: "HD",
						type: "mp4"
					}
				);
			}			
			
			this.videoJWPlayer.setup
				({
					controls: false,
					autostart: true,
					mute: true,
					repeat: true,
					height: "100%",
					width: "100%",
					stretching: "fill",
					playlist:
					[
						{
							// "title": "One Playlist Item With Multiple Qualities",
							// "description": "Two Qualities - One Playlist Item",
							mediaid: this.guid(),
							sources: playListSourceArray
						}
					]
				});	
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
	};	
}