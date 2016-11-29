import { Injectable }           from '@angular/core';

import { BaseDomainModel }      from './base-domain.model';

@Injectable()
export class ApiCloudCmsModel extends BaseDomainModel
{
    constructor () 
    { 
        super();
    }     
}