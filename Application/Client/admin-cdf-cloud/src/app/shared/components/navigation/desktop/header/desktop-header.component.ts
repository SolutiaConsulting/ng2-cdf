import { Router } 						from '@angular/router';
import { Component, OnInit, Input } 	from '@angular/core';

@Component({
	selector: 'dsb-desktop-header',
	templateUrl: './desktop-header.component.html',
	styleUrls: [ './desktop-header.component.scss' ],
	providers: []
})
export class DesktopHeaderComponent implements OnInit 
{
	@Input() title: string;
	
	constructor()
	{
	}

	ngOnInit()
	{
	}
}