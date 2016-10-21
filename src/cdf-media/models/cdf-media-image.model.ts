import { CdfMediaModel } from './cdf-media.model';

export class CdfMediaImageModel extends CdfMediaModel
{
	constructor()
	{
		super();

		this.IsImage = true;
		this.IsVideo = false;		
	}
}