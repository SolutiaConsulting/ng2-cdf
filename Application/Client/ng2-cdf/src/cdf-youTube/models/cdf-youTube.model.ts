import { CdfMediaModel } 		from '../../cdf-media/models/index';

export class CdfYouTubeModel extends CdfMediaModel
{  
	ChannelTitle: string;
	PublishedAt: string;

	constructor(rawJson: any)
	{
		super(rawJson, 'CdfYouTubeModel');

		if(rawJson)
		{
			//NodeId
			if(rawJson.id && rawJson.id.videoId)
			{
				this.NodeId = rawJson.id.videoId;

				//SET YOUTUBE ID
				super.SetYouTubeId(rawJson.id.videoId);
			}

			if(rawJson.snippet)
			{

				//Title
				if(rawJson.snippet.title)
				{
					this.Title = rawJson.snippet.title;
				}

				//Description
				if(rawJson.snippet.description)
				{
					this.Description = rawJson.snippet.description;
				}

				//ChannelTitle
				if(rawJson.snippet.channelTitle)
				{
					this.ChannelTitle = rawJson.snippet.channelTitle;
				}

				//PublishedAt
				if(rawJson.snippet.publishedAt)
				{
					this.PublishedAt = rawJson.snippet.publishedAt;
					this.TimeStamp = new Date(rawJson.snippet.publishedAt);
				}

				//POSTER IMAGE
				if(rawJson.snippet.thumbnails && rawJson.snippet.thumbnails.high && rawJson.snippet.thumbnails.high.url)
				{
					super.SetImage('high-fidelity-image', rawJson.snippet.thumbnails.high.url)
				}
				else if(rawJson.snippet.thumbnails && rawJson.snippet.thumbnails.medium && rawJson.snippet.thumbnails.medium.url)
				{
					super.SetImage('medium-fidelity-image', rawJson.snippet.thumbnails.medium.url)
				}
				else if(rawJson.snippet.thumbnails && rawJson.snippet.thumbnails.default && rawJson.snippet.thumbnails.default.url)
				{
					super.SetImage('default-fidelity-image', rawJson.snippet.thumbnails.default.url)
				}
			}
		}
	}	
}