import { CdfPostModel } 	from './index';

export class CdfRequestModel
{
	CacheKey?: string;
	GetList?: string[]; 
	PostList?: CdfPostModel[];

	constructor()
	{
	}
}