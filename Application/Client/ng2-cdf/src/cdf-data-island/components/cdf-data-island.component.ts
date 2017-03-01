import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit } 					from '@angular/core';
import { Observable } 			from 'rxjs/Rx';

import { CdfDataService }	from '../services/index';
import { CdfRequestModel }		from '../models/index';

@Component({
	selector: 'cdf-data-island',
	template: ''
})
export class CdfDataIslandComponent implements OnInit 
{
	@Input() RequestData: CdfRequestModel;
	@Output() onContentReceived = new EventEmitter<any>();
	@Output() onContentError = new EventEmitter<any>();
	
	constructor(
		private cdfDataService: CdfDataService
	)
	{

	}

	ngOnInit()
	{
		//console.log('RequestData INPUT:', this.RequestData);

		this.cdfDataService.requestData(this.RequestData)
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
					this.onContentError.emit(err.message);
				},

				//ON COMPLETE
				() => null
			)
	}
}