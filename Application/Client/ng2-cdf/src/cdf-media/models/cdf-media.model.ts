import { CdfRootModel } 		from './cdf-root.model';
import { CdfVideoModel } 		from './cdf-video.model';
import { ClientConfigService }	from '../../services/client-config.service'; 

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
			//ImageId - VERSION 1
			if (rawJson.media && rawJson.media.image && rawJson.media.image.id)
			{
				this.ImageId = rawJson.media.image.id;
				this.ImageUri = ClientConfigService.BuildCloudCmsMediaUrl(this.ImageId);
				this.HasImage = true;
			}
			//ImageId - VERSION 2
			else if (rawJson.image && rawJson.image.id)
			{
				this.ImageId = rawJson.image.id;
				this.ImageUri = ClientConfigService.BuildCloudCmsMediaUrl(this.ImageId);
				this.HasImage = true;
			}


			//VIDEO
			if (rawJson.videoList)
			{ 
				for (let entry of rawJson.videoList) 
				{
					if (entry && entry.video && entry.video.id)
					{ 
						let videoId = entry.video.id;
						let videoUri =ClientConfigService.BuildCloudCmsMediaUrl(videoId);
						let cdfVideoModel = new CdfVideoModel(videoId, videoUri);

						this.VideoList.push(cdfVideoModel);
					}	
				}				
			}			


			//YouTubeId
			if (rawJson.youTubeId)
			{
				this.YouTubeId = rawJson.youTubeId;
				this.HasVideo = true;
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

	SetYouTubeId(youTubeId: string)
	{
		this.YouTubeId = youTubeId;
		this.HasVideo = true;
	};	
}