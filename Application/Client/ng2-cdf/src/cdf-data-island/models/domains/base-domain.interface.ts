import { Observable } 			from 'rxjs/Rx';

import { CdfPostModel }			from '../cdf-post.model';
import { CdfSettingsService }	from '../../services/cdf-settings.service'; 

export interface BaseDomainInterface 
{
    HasToken(domain:string): boolean;
    GetToken(domain:string): string; 
    SetToken(domain:string, token: any): void;   
    DeleteToken(domain:string): void;    
    
    HashUrlFragment(urlFragment : string) : number;

    AuthenticateObservable(errorUrl: string, cdfSettingsService: CdfSettingsService) : Observable<any>;
    HttpGet(url: string): Observable<any>;
    HttpPost(postModel: CdfPostModel): Observable<any>;
}