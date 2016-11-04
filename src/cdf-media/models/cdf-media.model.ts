export class CdfMediaModel
{  
	Type: string;
	NodeId: string;
	Title: string;
	Description: string;
	ImageId: string;
	ImageUri: string;
	YouTubeId: string;
	HasImage: boolean;
	HasVideo: boolean;

	constructor(rawJson?: any, type?: string)
	{
		this.Type = type;
		
		if (rawJson)
		{ 
			//NODE Id
			if (rawJson._doc)
			{
				this.NodeId = rawJson._doc;
			}
			//NODE Id
			else if (rawJson.id)
			{
				this.NodeId = rawJson.id;
			}

			//NODE TITLE
			if (rawJson.title)
			{
				this.Title = rawJson.title;
			}

			//NODE DESCRIPTION		
			if (rawJson.description)
			{ 
				this.Description = rawJson.description;
			}			

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

	static ProcessJsonIntoImage(rawJson: any) : CdfMediaModel
	{ 
		if (rawJson)
		{ 
			//ImageId - VERSION 1
			if (rawJson && rawJson.media && rawJson.media.image && rawJson.media.image.id)
			{
				let cdfMediaModel = new CdfMediaModel();
				cdfMediaModel.ImageId = rawJson.media.image.id;
				cdfMediaModel.HasImage = true;

				return cdfMediaModel;
			}
			//ImageId - VERSION 2
			else if (rawJson && rawJson.image && rawJson.image.id)
			{
				let cdfMediaModel = new CdfMediaModel();
				cdfMediaModel.ImageId = rawJson.image.id;
				cdfMediaModel.HasImage = true;

				return cdfMediaModel;
			}
			//ImageId - VERSION 3
			else if (rawJson && rawJson.id)
			{
				let cdfMediaModel = new CdfMediaModel();
				cdfMediaModel.ImageId = rawJson.id;
				cdfMediaModel.HasImage = true;

				return cdfMediaModel;
			}			
		}			

		return undefined;
	}	

	OnClick()
	{ 
		let message = 'OnClick METHOD MUST BE IMPLEMENTED BY CHILD COMPONENT TO CdfMediaModel';
		alert(message);
		console.log('ERROR:', message);
	};
}