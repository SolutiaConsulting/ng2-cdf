import { CdfAuthorizationModel } 	from './cdf-authorization.model';
import { CdfPostModel } 			from './cdf-post.model';

export class CdfRequestModel
{
	CacheKey?: string;
	AuthorizationModel: CdfAuthorizationModel = undefined;
	GetList: string[] = []; 
	PostList: CdfPostModel[] = [];

	constructor()
	{
	}
}