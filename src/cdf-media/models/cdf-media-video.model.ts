import { CdfMediaModel } from './cdf-media.model';

export class CdfMediaVideoModel extends CdfMediaModel
{
	constructor()
	{
		super();

		this.IsImage = false;
		this.IsVideo = true;
	}
}