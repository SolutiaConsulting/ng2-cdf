import { Component, OnInit, Input } 	from '@angular/core';

import { CdfMediaImageModel }			from '../../models/index';

@Component({
	selector: 'cdf-image',
	templateUrl: './cdf-image.component.html',
	styleUrls: [ './cdf-image.component.less' ]
})
export class CdfImageComponent implements OnInit 
{
	@Input()
	imageModel: CdfMediaImageModel;

	constructor()
	{
	}

	ngOnInit()
	{
	}
}