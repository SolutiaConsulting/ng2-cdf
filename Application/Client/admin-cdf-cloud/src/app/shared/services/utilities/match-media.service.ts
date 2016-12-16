export class MatchMediaService 
{

/* ZURB MEDIA QUERIES: */	
//	// Small screens
//	@media only screen { } /* Define mobile styles */
//	@media only screen and (max-width: 40em) { } /* max-width 640px, mobile-only styles, use when QAing mobile issues */

//	// Medium screens
//	@media only screen and (min-width: 40.063em) { } /* min-width 641px, medium screens */
//	@media only screen and (min-width: 40.063em) and (max-width: 64em) { } /* min-width 641px and max-width 1024px, use when QAing tablet-only issues */

//	// Large screens
// 	@media only screen and (min-width: 64.063em) { } /* min-width 1025px, large screens */
// 	@media only screen and (min-width: 64.063em) and (max-width: 90em) { } /* min-width 1025px and max-width 1440px, use when QAing large screen-only issues */

// 	// XLarge screens
// 	@media only screen and (min-width: 90.063em) { } /* min-width 1441px, xlarge screens */
// 	@media only screen and (min-width: 90.063em) and (max-width: 120em) { } /* min-width 1441px and max-width 1920px, use when QAing xlarge screen-only issues */

// 	// XXLarge screens
// 	@media only screen and (min-width: 120.063em) { } /* min-width 1921px, xxlarge screens */	


	static rules =
	{		
		//20rem = 320px
		//20.0625rem = 321px
		//39.9999rem = 639px
		small: 'only screen and (min-width : 20rem) and (max-width : 39.9999rem)',
		smallPortrait: 'only screen and (max-width : 20rem) and (orientation : portrait)',
		smallLandscape: 'only screen and (min-width : 20.0625rem) and (max-width : 39.9999rem) and (orientation : landscape)',

		//64rem = 1024px
		smallOrMedium: 'only screen and (max-width : 64rem)',

		//40rem = 640px		
		//64rem = 1024px
		medium: 'only screen and (min-width : 40rem) and (max-width : 64rem)',		
		mediumPortrait: 'only screen and (min-width : 40rem) and (max-width : 64rem) and (orientation : portrait)',
		mediumLandscape: 'only screen and (min-width : 40rem) and (max-width : 64rem) and (orientation : landscape)',

		//64.0625rem = 1025px
		large: 'only screen and (min-width: 64.0625rem)',

		//MISCELLANEOUS
		landscape: '(orientation: landscape)',
		portrait: '(orientation: portrait)',
		retina: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)'
	};

	static Check = function (mq) : boolean
	{
		if (!mq)
		{
			return false;
		}

		return window.matchMedia(mq).matches;
	};

	
/**********************************************
	METHODS FOR CHECKING TYPE	
 **********************************************/
	//SMALL	
	static IsSmall()
	{
		return (MatchMediaService.Check(MatchMediaService.rules.small) || MatchMediaService.IsSmallLandscape() || MatchMediaService.IsSmallPortrait());
	};
	static IsSmallLandscape()
	{
		return MatchMediaService.Check(MatchMediaService.rules.smallLandscape);
	};
	static IsSmallPortrait()
	{
		return MatchMediaService.Check(MatchMediaService.rules.smallPortrait);
	};
	

	//SMALL OR MEDIUM	
	static IsSmallOrMedium()
	{ 
		return (MatchMediaService.IsSmall() || MatchMediaService.IsMedium());
	};
	
	
	//MEDIUM	
	static IsMedium()
	{ 
		return (MatchMediaService.Check(MatchMediaService.rules.medium) || MatchMediaService.IsMediumLandscape() || MatchMediaService.IMediumPortrait());
	};
	static IsMediumLandscape()
	{
		return MatchMediaService.Check(MatchMediaService.rules.mediumLandscape);
	};	
	static IMediumPortrait()
	{
		return MatchMediaService.Check(MatchMediaService.rules.mediumPortrait);
	};	
	


	//LARGE	
	static IsLarge()
	{
		return MatchMediaService.Check(MatchMediaService.rules.large);
	};


	//CUSTOM MATCH	
	static IsCustomMatch(matchMediaRule: string)
	{
		return MatchMediaService.Check(matchMediaRule);
	};


	//MISCELLANEOUS
	static IsLandscape()
	{
		return MatchMediaService.Check(MatchMediaService.rules.landscape);
	};		
	static IsPortrait()
	{
		return MatchMediaService.Check(MatchMediaService.rules.portrait);
	};
	static IsRetina()
	{
		return MatchMediaService.Check(MatchMediaService.rules.retina);
	};

	
	
/**********************************************
	EVENT LISTENERS BY TYPE
 **********************************************/
	//SMALL	
	static OnSmall(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.small);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON SMALL - PORTRAIT OR LANDSCPE');
					callBack(mql);
				}
			});
		}
	};
	static OnSmallLandscape(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.smallLandscape);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON SMALL - LANDSCPE');
					callBack(mql);
				}
			});
		}
	};	
	static OnSmallPortrait(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.smallPortrait);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON SMALL - PORTRAIT');
					callBack(mql);
				}
			});
		}
	};		
	

	//SMALL OR MEDIUM	
	static OnSmallOrMedium(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.smallOrMedium);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON SMALL - LANDSCPE');
					callBack(mql);
				}
			});
		}
	};	

	//MEDIUM
	static OnMedium(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.medium);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON MEDIUM - PORTRAIT OR LANDSCPE');
					callBack(mql);
				}
			});
		}
	};	
	static OnMediumLandscape(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.mediumLandscape);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON MEDIUM - LANDSCPE');
					callBack(mql);
				}
			});
		}
	};		
	static OnMediumPortrait(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.mediumPortrait);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON MEDIUM - PORTRAIT');
					callBack(mql);
				}
			});
		}
	};	
	

	//LARGE	
	static OnLarge(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.large);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON LARGE...');
					callBack(mql);
				}
			});
		}
	};	
	

	//CUSTOM MATCH	
	static OnCustomMatch(matchMediaRule: string, callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(matchMediaRule);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON CUSTOM MATCH...', matchMediaRule);
					callBack(mql);
				}
			});
		}
	};	

	//MISCELLANEOUS
	static OnLandscape(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.landscape);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON LANDSCAPE');
					callBack(mql);
				}
			});
		}
	};	
	static OnPortrait(callBack)
	{
		if (typeof callBack === 'function')
		{
			let mql: MediaQueryList = window.matchMedia(MatchMediaService.rules.portrait);

			mql.addListener((mql: MediaQueryList) =>
			{
				if (mql.matches)
				{
					//console.log('ON PORTRAIT');
					callBack(mql);
				}
			});
		}
	};	

	
	static WhatAmI()
	{
		var answer: string = '';

		if (MatchMediaService.IsSmall())
		{
			answer += 'small (MOBILE): ';
		}
		if (MatchMediaService.IsMedium())
		{
			answer += 'medium (TABLET): ';
		}
		if (MatchMediaService.IsLarge())
		{
			answer += 'large (DESKTOP): ';
		}
		if (MatchMediaService.IsLandscape())
		{
			answer += 'landscape ';
		}
		if (MatchMediaService.IsPortrait())
		{
			answer += 'portrait ';
		}
		if (MatchMediaService.IsRetina())
		{
			answer += 'retina ';
		}

		return answer;
	};
}