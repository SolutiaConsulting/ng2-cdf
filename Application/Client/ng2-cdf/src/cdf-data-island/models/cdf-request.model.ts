import { CdfGetModel } 		from './cdf-get.model';
import { CdfPostModel } 	from './cdf-post.model';


export class CdfRequestModel
{
	ApplicationKey: string;
	CacheKey?: string;	
	GetList: CdfGetModel[] = []; 
	PostList: CdfPostModel[] = [];

	constructor()
	{
	}
}