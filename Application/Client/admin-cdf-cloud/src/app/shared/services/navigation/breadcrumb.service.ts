import { Injectable } 	from '@angular/core';
import { Observable } 	from 'rxjs/Rx';
import { Subject } 		from 'rxjs/Subject';

import { BreadcrumbModel }	from '../../models/content/breadcrumb.model';

@Injectable()
export class BreadcrumbService 
{
  	// Observable Sources
	private hasBreadCrumbSource = new Subject<boolean>();
	
	// OBSERVABLES
	hasBreadCrumbObservable = this.hasBreadCrumbSource.asObservable();

	BreadCrumbList: BreadcrumbModel[] = [];
	PageName: string;

	constructor()
	{
	}

	AddBreadcrumb(breadcrumbName:string , title: string, onClick:Function)
	{ 
		if (!this.BreadCrumbList)
		{ 
			this.BreadCrumbList = [];
		}	

		if (typeof onClick === "function")
		{ 
			this.BreadCrumbList.push(new BreadcrumbModel(breadcrumbName, title, onClick));
		}						

		this.hasBreadCrumbSource.next((this.BreadCrumbList && this.BreadCrumbList.length > 0));
	}

	ClearBreadcrumbs()
	{ 
		this.BreadCrumbList = undefined;		
		this.PageName = '';

		this.hasBreadCrumbSource.next((this.BreadCrumbList && this.BreadCrumbList.length > 0));
	};
}