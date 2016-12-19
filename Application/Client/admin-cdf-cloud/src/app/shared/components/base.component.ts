import { Component, NgZone } from '@angular/core';

import { MatchMediaService } from '../services/utilities/match-media.service';

@Component({
	selector: 'cdf-base',
	template: '<ng-content></ng-content>',
	providers: []
})
export class BaseComponent 
{
	IsSmallOrMedium: boolean = false;
	IsLarge: boolean = false;
	
	constructor(
		private zone: NgZone		
	)
	{
		//this.WhatAmI();
		this.IsSmallOrMedium = MatchMediaService.IsSmallOrMedium();
		this.IsLarge = MatchMediaService.IsLarge();
		
		var that = this;

		//ON SMALL		
		MatchMediaService.OnSmall(
			function (mediaQueryList: MediaQueryList)
			{
				that.ShowSmallOrMedium();
			}
		);
		//ON SMALL LANDSCAPE		
		MatchMediaService.OnSmallLandscape(
			function (mediaQueryList: MediaQueryList)
			{
			}
		);
		//ON SMALL PORTRAIT
		MatchMediaService.OnSmallPortrait(
			function (mediaQueryList: MediaQueryList)
			{
			}
		);
		

		//ON MEDIUM	LANDSCAPE OR PORTRAIT
		MatchMediaService.OnMedium(
			function (mediaQueryList: MediaQueryList)
			{
				that.ShowSmallOrMedium();
			}
		);
		//ON MEDIUM	LANDSCAPE
		MatchMediaService.OnMediumLandscape(
			function (mediaQueryList: MediaQueryList)
			{
			}
		);
		//ON MEDIUM	PORTRAIT
		MatchMediaService.OnMediumPortrait(
			function (mediaQueryList: MediaQueryList)
			{
			}
		);


		//ON LARGE		
		MatchMediaService.OnLarge(
			function (mediaQueryList: MediaQueryList)
			{
				that.ShowLarge();
			}
		);


		//ON LANDSCAPE		
		MatchMediaService.OnLandscape(
			function (mediaQueryList: MediaQueryList)
			{				
			}
		);

		//ON PORTRAIT		
		MatchMediaService.OnPortrait(
			function (mediaQueryList: MediaQueryList)
			{				
			}
		);		
	}

	WhatAmI()
	{
		console.log('what am i :', MatchMediaService.WhatAmI());
		console.log('is Small:', MatchMediaService.IsSmall());
		console.log('is Medium:', MatchMediaService.IsMedium());
		console.log('is Large:', MatchMediaService.IsLarge());
		console.log('is Landscape:', MatchMediaService.IsLandscape());
		console.log('is Portrait:', MatchMediaService.IsPortrait());
		console.log('---------------------------------------------------------------------------');
	}

	//ShowSmallOrMedium is defined as showing for Small or Medium widths
	ShowSmallOrMedium()
	{
		//this.WhatAmI();
		
		this.zone.run(() =>
		{ // Change the property within the zone, CD will run after
			this.IsSmallOrMedium = true;
			this.IsLarge = false;
		});
	}

	// //ShowLarge is defined as showing for large widths	
	ShowLarge()
	{
		//this.WhatAmI();

		this.zone.run(() =>
		{ // Change the property within the zone, CD will run after
			this.IsSmallOrMedium = false;
			this.IsLarge = true;
		});
	}	
}