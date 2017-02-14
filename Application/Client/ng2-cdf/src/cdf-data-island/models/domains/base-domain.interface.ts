import { Observable } 			    from 'rxjs/Rx';
import { Http } 				    from '@angular/http';

import { CdfPostModel }			    from '../cdf-post.model';
import { CdfAuthorizationModel }    from '../cdf-authorization.model';

export interface BaseDomainInterface 
{
    AuthorizationModel: CdfAuthorizationModel
    InjectHttp() : Http;
    
    SetAuthorizationModel(authorizationModel: CdfAuthorizationModel): void;

    HasToken(domain: string): boolean;
    GetTokenValueFromStorage(domainName: string): string;
    GetToken(domain:string): string; 
    SetToken(domain:string, token: any): void;   
    DeleteToken(domain:string): void;    
    
    HashUrlFragment(urlFragment : string) : number;

    AuthenticateObservable(errorUrl: string) : Observable<any>;
    HttpGet(url: string): Observable<any>;
    HttpPost(postModel: CdfPostModel): Observable<any>;
}