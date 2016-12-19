import { NgModule } 				from '@angular/core';
import { RouterModule } 			from '@angular/router';
import { CommonModule }        		from '@angular/common';

import { BreadcrumbsComponent }		from './desktop/breadcrumbs/breadcrumbs.component';
import { DesktopFooterComponent }	from './desktop/footer/desktop-footer.component';
import { DesktopHeaderComponent }	from './desktop/header/desktop-header.component';
import { MobileFooterComponent }	from './mobile/footer/mobile-footer.component';
import { MobileHeaderComponent }	from './mobile/header/mobile-header.component';

@NgModule({
	imports:
	[
        CommonModule,
		RouterModule
	],
	declarations:
	[
		BreadcrumbsComponent,
		
		DesktopFooterComponent,
		DesktopHeaderComponent,

		MobileFooterComponent,
		MobileHeaderComponent
	],
	exports:
	[
		DesktopHeaderComponent,
		MobileHeaderComponent
	],
	providers:
	[
	]
})
export class NavigationModule { }