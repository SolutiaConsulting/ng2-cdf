export class CdfTweetUserModel
{  
	Id: string;
	Name: string;
	ScreenName: string;
	Description: string;
	Location: string;
	ProfileImageUrl: string;
	ProfileImageUrlHttps: string;	
	CreatedAt : string;

	constructor(rawJson: any)
	{
		if(rawJson)
		{
			if(rawJson.id)
			{
				this.Id = rawJson.id;
			}	

			if(rawJson.name)
			{
				this.Name = rawJson.name;
			}

			if(rawJson.screen_name)
			{
				this.ScreenName = rawJson.screen_name;
			}

			if(rawJson.description)
			{
				this.Description = rawJson.description;
			}

			if(rawJson.location)
			{
				this.Location = rawJson.location;
			}

			if(rawJson.profile_image_url)
			{
				this.ProfileImageUrl = rawJson.profile_image_url;
			}

			if(rawJson.profile_image_url_https)
			{
				this.ProfileImageUrlHttps = rawJson.profile_image_url_https;
			}

			if(rawJson.created_at)
			{
				this.CreatedAt = rawJson.created_at;
			}																								
		}
	}	
}