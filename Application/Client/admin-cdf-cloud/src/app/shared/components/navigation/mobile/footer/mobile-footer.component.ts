import { Component, OnInit, Input } 	from '@angular/core';
import { Location } 					from '@angular/common';

import { NavigationService } 			from '../../../../services/navigation/navigation.service';

@Component({
	selector: 'dsb-mobile-footer',
	templateUrl: './mobile-footer.component.html',
	styleUrls: [ './mobile-footer.component.scss' ],
	providers: []
})
export class MobileFooterComponent implements OnInit 
{	
	constructor(private navigationervice: NavigationService, private location: Location)
	{
	}

	ngOnInit()
	{
	}

	GoBack()
	{ 
		//IF NAVIGATION HISTORY HAS A VALUE, THEN GO TO LAST LOCATION,
		//ELSE, GO TO PROVIDED DEFAULT BACK LOCATION
		if (this.navigationervice.HasNavigationHistory())
		{
			this.location.back();
		}	
	}
}