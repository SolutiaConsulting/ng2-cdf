import { Router } 					from '@angular/router';
import { Component, OnInit } 		from '@angular/core';

import { BreadcrumbService } 		from '../../../../services/navigation/breadcrumb.service';
import { NavigationService } 		from '../../../../services/navigation/navigation.service';
import { BreadcrumbModel }			from '../../../../models/content';

@Component({
	selector: 'dsb-breadcrumbs',
	templateUrl: './breadcrumbs.component.html',
	styleUrls: [ './breadcrumbs.component.scss' ],
	providers: []
})
export class BreadcrumbsComponent implements OnInit 
{	
	hasBreadCrumbs: boolean;

	constructor
	(
		private breadcrumbService: BreadcrumbService,
		private navigationService: NavigationService
	)
	{
	};

	ngOnInit()
	{
		this.breadcrumbService.hasBreadCrumbObservable.subscribe(
			//SUCCESS
			data =>
			{	
				this.hasBreadCrumbs = data;
			},

			//ERROR
			err =>
			{ 
			},

			//COMPLETE
			() =>
			{ 
			}		
		)
	};

	GoToHomeState()
	{ 
		this.navigationService.GoToHomePage();
	};

	GoToBreadcrumb(breadcrumb: BreadcrumbModel)
	{ 
		breadcrumb.OnClick();
	};
}