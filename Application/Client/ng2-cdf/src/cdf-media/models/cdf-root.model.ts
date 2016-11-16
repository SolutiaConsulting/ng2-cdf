export class CdfRootModel
{  
	Type: string;
	NodeId: string;
	Title: string;
	Description: string;

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
		}	
	}	

	OnClick()
	{ 
		let message = 'OnClick METHOD MUST BE IMPLEMENTED BY CHILD COMPONENT TO CdfMediaModel';
		alert(message);
		console.log('ERROR:', message);
	};
}