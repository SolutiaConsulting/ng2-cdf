import
{
	Component,
	OnInit,
	HostListener,
	Input
} 									from '@angular/core';

@Component({
	selector: 'dsb-mobile-header',
	templateUrl: './mobile-header.component.html',
	styleUrls: [ './mobile-header.component.scss' ],
	providers: []	
})
export class MobileHeaderComponent implements OnInit 
{
	@Input()
	title: string;
	
	navOpen = false;

	constructor()
	{

	}

	ngOnInit()
	{
	}

  	@HostListener('window:keyup', ['$event'])
	outerClick(event) 
	{
		if (event.keyCode === 27 && this.navOpen === true) 
		{
      		this.navOpen = false;
		}
	}
}