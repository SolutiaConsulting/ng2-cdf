import { CdfPostModel } 			from './cdf-post.model';

export class CdfRequestModel
{
	CacheKey?: string;
	GetList?: string[]; 
	PostList?: CdfPostModel[];

	constructor()
	{
	}
}