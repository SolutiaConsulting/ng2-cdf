import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit } 					from '@angular/core';
import { Observable } 			from 'rxjs/Rx';

import { DataIslandService }	from '../services/cdf-data.service';
import { cdfRequestModel }			from '../models/cdf-model-request';

@Component({
	selector: 'cdf-data-island',
	template: ''
})
export class DataIslandComponent implements OnInit 
{
	@Input() RequestData: cdfRequestModel;
	@Output() onContentReceived = new EventEmitter<any>();
	
	constructor(
		private dataIslandService: DataIslandService
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
					//console.log('********** DataIslandComponent SUCCESS:', rawJson);
					this.onContentReceived.emit(rawJson);
				},

				//ERROR
				err => 					
				{
					//console.log('********** DataIslandComponent ERROR:', err.message);					
				},

				//ON COMPLETE
				() => null
			)
	}	
}