export class CdfVideoModel
{  
	VideoId: string;
	VideoUri: string;

	constructor(videoId: string, videoUri: string)
	{
		this.VideoId = videoId;
		this.VideoUri = videoUri;
	}	
}