import { cdfPostModel } 			from './cdf-model-post';

export class cdfRequestModel
{
	CacheKey?: string;
	GetList?: string[]; 
	PostList?: cdfPostModel[];

	constructor()
	{
	}
}