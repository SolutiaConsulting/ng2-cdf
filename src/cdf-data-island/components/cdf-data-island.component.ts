import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnInit } 					from '@angular/core';
import { Observable } 			from 'rxjs/Rx';

import { CdfDataHelperService }	from '../services/index';
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
		private cdfDataHelperService: CdfDataHelperService
	)
	{

	}

	ngOnInit()
	{
		//console.log('RequestData INPUT:', this.RequestData);

		this.cdfDataHelperService.requestData(this.RequestData)
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