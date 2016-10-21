import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit } 						from '@angular/core';
import { Observable } 				from 'rxjs/Rx';

import { CdfDataIslandService }		from '../services/index';
import { CdfRequestModel }			from '../models/index';

@Component({
	selector: 'cdf-data-island',
	template: ''
})
export class CdfDataIslandComponent implements OnInit 
{
	@Input() RequestData: CdfRequestModel;
	@Output() onContentReceived = new EventEmitter<any>();
	
	constructor(
		private dataIslandService: CdfDataIslandService
	)
	{

	}

	ngOnInit()
	{
		this.MakeRequest();
	}

	private MakeRequest()
	{ 
		//console.log('RequestData INPUT:', this.RequestData);

		this.dataIslandService.requestData(this.RequestData)
			//	IF AN ERROR HAPPENS, RETRY 3 TIMES - An incrememntal back-off strategy for handling errors:
			//
			// 	*********************************************************************************** 
			// 	** THIS WILL RETRY THE OBSERVABLE RETURNED BY 'this.dataIslandService.get' ABOVE
			//	** 3 times before giving up
			// 	***********************************************************************************
			//
			//	SEE https://xgrommx.github.io/rx-book/content/observable/observable_instance_methods/retrywhen.html	
			//
			.retryWhen(function (attempts) 
			{
				return Observable.range(1, 3).zip(attempts, function (i) { return i; }).flatMap(function (i) 
				{
					//console.log("delay retry by: " + i + " second(s)");
					return Observable.timer(i * 1000);
				});
			})	
			.subscribe
			(
				//SUCCESS - SEND RAW JSON BACK TO PARENT VIA EVENT EMITTER
				rawJson =>
				{
					//console.log('********** CdfDataIslandComponent SUCCESS:', rawJson);
					this.onContentReceived.emit(rawJson);
				},

				//ERROR
				err => 					
				{
					//console.log('********** CdfDataIslandComponent ERROR:', err.message);					
				},

				//ON COMPLETE
				() => null
			)
	}	
}