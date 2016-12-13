import { CdfMediaModel } 		from '../../cdf-media/models/index';
import { CdfTweetUserModel }	from './cdf-tweet-user.model';

export class CdfTweetModel extends CdfMediaModel
{  
	Id: string;
	Text: string;
	User: CdfTweetUserModel;
	MediaUrl: string;
	HashTags: string[] = [];
	CreatedAt : string;

	constructor(rawJson: any)
	{
		super(rawJson, 'CdfTweetModel');

		if(rawJson)
		{
			if(rawJson.id_str)
			{
				this.Id = rawJson.id_str;
			}

			if(rawJson.text)
			{
				this.Text = rawJson.text;
			}

			if(rawJson.user)
			{
				this.User = new CdfTweetUserModel(rawJson.user);
			}

			if(rawJson.entities && rawJson.entities.media && rawJson.entities.media.length > 0)
			{
				this.MediaUrl = rawJson.entities.media[0].media_url;
			}

			//Schedule
			if(rawJson.entities && rawJson.entities.hashtags && rawJson.entities.hashtags.length > 0)
			{
				for (let entry of rawJson.entities.hashtags) 
				{
					this.HashTags.push(entry.text);
				}
			}			

			if(rawJson.created_at)
			{
				this.CreatedAt = rawJson.created_at;
			}
		}
	}	
}