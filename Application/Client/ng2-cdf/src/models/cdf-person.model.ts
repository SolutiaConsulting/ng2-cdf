import { CdfMediaModel } 	from '../cdf-media/models/cdf-media.model';

export class CdfPersonModel extends CdfMediaModel
{  
	FirstName: string;
	LastName: string;

	constructor(rawJson?: any, type?: string)
	{
		super(rawJson, type);

		if (rawJson)
		{ 
			//FirstName
			if (rawJson.firstName)
			{
				this.FirstName = rawJson.firstName;
			}

			//LastName
			if (rawJson.lastName)
			{
				this.LastName = rawJson.lastName;
			}		
		}	
	}
}