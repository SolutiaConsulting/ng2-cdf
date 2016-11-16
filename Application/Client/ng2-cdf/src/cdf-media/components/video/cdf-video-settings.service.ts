import { Injectable } 		from '@angular/core';

/*
THIS SERVICE IS HOW NG2-CDF GETS CONFIGURED.  THE CLIENT CONSUMING CDF MUST PROVIDE 
CONFIGURATION WHEN BOOTSTRAPPING APPLICATION:

@NgModule({
	imports:
	[
		CommonModule,
		RouterModule,

		//CONFIGURE CONTENT DELIVERY FRAMEWORK (CDF) WITH CREDENTIALS FOR DIFFERENT REST SOURCES		
		CdfModule.forRoot(configArray)
	],
	declarations:
	[
		//COMPONENTS
	],
	exports:
	[		
		//COMPONENTS

		//MODULES

		//APPLICATION MODULES

		//3RD PARTY...
		CdfModule		
	]
})


provideCdfSettingsService (AT BOTTOM OF THIS FILE)
 IS USED TO PROVIDE AN INSTANCE OF CdfSettingsService CONSUMING THE PROVIDED CONFIGURATIOM

http://blog.rangle.io/configurable-services-in-angular-2/

 */

@Injectable()
export class CdfVideoSettingsService 
{
	JwPlayerKey: string;

	constructor( jwPlayerKey: string )
	{ 
		this.JwPlayerKey = jwPlayerKey;
	}
}

export function provideCdfVideoSettingsService( jwPlayerKey: string ) 
{
	return { provide: CdfVideoSettingsService, useFactory: () => new CdfVideoSettingsService(jwPlayerKey) }
}