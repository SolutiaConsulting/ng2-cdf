import { CdfRootModel } 	from './cdf-root.model';
import { CdfVideoModel } 	from './cdf-video.model';

export class CdfMediaModel extends CdfRootModel
{  
	ImageId: string;
	ImageUri: string;
	VideoList: CdfVideoModel[] = [];
	YouTubeId: string;
	HasImage: boolean;
	HasVideo: boolean;

	constructor(rawJson?: any, type?: string)
	{
		super(rawJson, type);
		
		if (rawJson)
		{ 
			//YouTubeId
			if (rawJson.youTubeId)
			{
				this.YouTubeId = rawJson.youTubeId;
				this.HasVideo = true;
			}		

			//ImageId - VERSION 1
			if (rawJson.media && rawJson.media.image && rawJson.media.image.id)
			{
				this.ImageId = rawJson.media.image.id;
				this.HasImage = true;
			}
			//ImageId - VERSION 2
			else if (rawJson.image && rawJson.image.id)
			{
				this.ImageId = rawJson.image.id;
				this.HasImage = true;
			}
		}	
	}

	SetImage(imageId: string, uri:string)
	{
		this.ImageId = imageId;
		this.ImageUri = uri;
		this.HasImage = true;
	};

	SetBackgroundVideo(videoList: CdfVideoModel[])
	{
		this.VideoList = videoList;
		this.HasVideo = true;
	};	
}