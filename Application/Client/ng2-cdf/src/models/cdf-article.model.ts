import { CdfMediaModel } 	from '../cdf-media/models/cdf-media.model';

export class CdfArticleModel extends CdfMediaModel
{  
	Body: string;
	Timestamp: string;

	constructor(rawJson?: any, type?: string)
	{
		super(rawJson, type);

		if (rawJson)
		{ 
			//Body
			if (rawJson.body)
			{
				this.Body = rawJson.body;
			}

			//Timestamp
			if (rawJson.timestamp)
			{
				this.Timestamp = rawJson.timestamp;
			}			
		}	
	}
}