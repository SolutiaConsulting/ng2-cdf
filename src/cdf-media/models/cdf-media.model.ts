export class CdfMediaModel
{  
	NodeId: string;
	Type: string;
	Title: string;
	Description: string;
	ImageUri: string;
	YouTubeId: string;
	IsImage: boolean;
	IsVideo: boolean;

	constructor()
	{
	}	

	OnClick()
	{ 
		let message = 'OnClick METHOD MUST BE IMPLEMENTED BY CHILD COMPONENT TO CdfMediaModel';
		alert(message);
		console.log('ERROR:', message);
	};
}