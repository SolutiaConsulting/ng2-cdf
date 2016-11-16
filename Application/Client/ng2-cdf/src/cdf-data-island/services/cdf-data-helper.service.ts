
import { Injectable } 			from '@angular/core';
import { Observable } 			from 'rxjs/Rx';
import { RequestOptionsArgs } 	from '@angular/http';
	
import { CdfDataService }		from './cdf-data.service';
import { CdfRequestModel }		from '../models/index';

@Injectable()
export class CdfDataHelperService
{
	constructor(
		private cdfDataService: CdfDataService
	)
	{ 
	}

	requestData(requestModel: CdfRequestModel, options?: RequestOptionsArgs) : Observable<any> 
	{
		return this.cdfDataService.requestData(requestModel, options)
			//	IF AN ERROR HAPPENS, RETRY 3 TIMES - An incrememntal back-off strategy for handling errors:
			//
			// 	*********************************************************************************** 
			// 	** THIS WILL RETRY THE OBSERVABLE RETURNED BY 'this.cdfDataService.requestData' ABOVE
			//	** 3 times before giving up
			// 	***********************************************************************************
			//
			//	SEE https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/retrywhen.html	
			//
			.retryWhen(function (attempts) 
			{
				return Observable.range(1, 4).zip(attempts, function (i) { return i; }).flatMap(function (i) 
				{
					if (i > 3) 
					{
						return Observable.throw(new Error('Request attempted 3 times and has failed...'));
					}
					else
					{ 
						//console.log("********************  DELAY RETRY BY: " + i + " second(s)");
						return Observable.timer(i * 750);
					}	
				});
			});
	}	
}