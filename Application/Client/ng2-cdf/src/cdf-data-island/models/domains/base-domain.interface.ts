import { Observable } 			from 'rxjs/Rx';
import { Http } 				from '@angular/http';

import { CdfPostModel }			from '../cdf-post.model';

export interface BaseDomainInterface 
{
    InjectHttp() : Http;
    
    HasToken(domain:string): boolean;
    GetToken(domain:string): string; 
    SetToken(domain:string, token: any): void;   
    DeleteToken(domain:string): void;    
    
    HashUrlFragment(urlFragment : string) : number;

    AuthenticateObservable(errorUrl: string) : Observable<any>;
    HttpGet(url: string): Observable<any>;
    HttpPost(postModel: CdfPostModel): Observable<any>;
}