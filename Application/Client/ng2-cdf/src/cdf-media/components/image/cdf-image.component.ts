import { Component, OnInit, Input } 	from '@angular/core';

import { CdfMediaModel }				from '../../models/index';

@Component({
	selector: 'cdf-image',
	template: `
	<section *ngIf="(imageModel)" 
		class="cdf-background-image" 
		[ngStyle]="{'background-image': 'url(' + imageModel.ImageUri + ')'}">		
	</section>
	<ng-content></ng-content>`,
	styles: [`
	:host 
	{
		margin: auto;
		width: 100%;
	}
		
	.cdf-background-image
	{
		background-repeat:no-repeat;
		background-size: cover;
		background-position:center center;	
		height: 100%;
		transition: all 0.3s ease 0s;
		width:100%;
	}`]
})
export class CdfImageComponent implements OnInit 
{
	@Input()
	imageModel: CdfMediaModel;

	constructor()
	{
	}

	ngOnInit()
	{
	}
}