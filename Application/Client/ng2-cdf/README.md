# ng2-cdf

# Angular2 Content Delivery Framework (CDF)

The purpose of cdf-data-island component is to surface JSON data to the caller.

## FEATURES:
* Supports caching of results using ng2-cache (https://github.com/Jackson88/ng2-cache)
* Supports ability to combine multiple GETs and POSTs URLS into a single Observable block
* Supports ability to combine requests from multiple domains into a single Observable block


## TODOS:
* test multiple domains
* need ability to surface errors to caller of cdf-data-island
* ability to supoort PUTs
* ability to support DELETEs
* placing cdf-data-island in GitHub so it can be used in multiple projects


___
## **_CdfRequestModel_**:
CdfRequestModel is the class used for gathering the GETs and POSTs http requests that will be called as a single Observable block
``` javascript
export class CdfRequestModel
{
	GetList: string[]; 
	PostList: CdfPostModel[];

	constructor()
	{
	}
}
```

* *GetList* is an array of GET requests
* *PostList* is an array of POST models


## **_CdfPostModel_**:
CdfPostModel is the class describing the data elements needed for a proper POST
``` javascript
export class CdfPostModel
{
	URL: string;
	Body: Object;

	constructor(url: string, body: Object)
	{
		this.URL = url;
		this.Body = body;
	}
}
```

* *URL* is the POST URL request
* *Body* is the body of the POST request 



___
## IMPLEMENTATION EXAMPLES:
``` javascript
	import { Component, OnInit } 				from '@angular/core';
	import { CdfPostModel, CdfRequestModel } 	from '../../../cdf-data-island/index';	

	@Component({
		selector: 'some-cool-custom-tag',
		templateUrl: './some-cool-custom-tag.component.html',
		styleUrls: [ './some-cool-custom-tag.component.less' ],
		providers: []
	})
	export class SomeCoolCustomComponent implements OnInit
	{
		RequestModel = new CdfRequestModel();

		ngOnInit() 
		{		
			//LIST OF GETS FOR DATA ISLAND		
			this.RequestModel.GetList =
				[
					'http://your-domain.com/something/something/1',
					'http://your-domain.com/something/something/2',
					'http://your-domain.com/something/something/3',
					'http://your-domain.com/something/something/4',
					'http://your-domain.com/something/something/5'
				];


			//POST FOR DATA ISLAND
			this.RequestModel.PostList = 
			[
				new CdfPostModel
				(
					//POST URL:
					'http://your-domain.com/something/something/5?limit=3&metadata=false&full=true',
				
					//POST BODY:
					{
						"_type": "stm:media-production-show",
						"mediaProduction.id": 34
					}
				)
			];
		}			

		/*
		rawJson will be an array where each item in array is the results of a GET or POST in RequestModel
		*/
		onContentReceived(rawJson: any) 
		{
			console.log('CONTENT RECEIVED:', rawJson);
		};	
	}
```

```html
	/* some-cool-custom-tag.component.html: */
	<cdf-data-island [RequestData]="RequestModel" 
				(onContentReceived)="onContentReceived($event)"
				(onContentError)="onContentError($event)"></cdf-data-island>

	<section>
		/* DISPLAY HTML HERE CONSUMING JSON RESULTS FROM CDF-DATA-ISLAND */
	</section>

```
CDF-DATA-ISLAND ATTRIBUTES:
* *RequestData* is RequestModel data type (see below) containing GETs and POSTs that are called as a single Observable block
* *(onContentReceived)* is the event binding that is called when results are returned for each call in Observable block 	
* *(onContentError)* is the event binding that is called when an error happens


___
## MULTIPLE HTTP REQUESTS:
CDF supports the ability to group multiple requests into a single Observable block.  Observables are part of new Angular2 RXJS implementation
	
* http://www.metaltoad.com/blog/angular-2-http-observables
* http://blog.thoughtram.io/angular/2016/01/06/taking-advantage-of-observables-in-angular2.html
* https://scotch.io/tutorials/angular-2-http-requests-with-observables

CDF combines multiple requests using ForkJoin
* http://www.syntaxsuccess.com/viewarticle/combining-multiple-rxjs-streams-in-angular-2.0
* http://restlet.com/blog/2016/04/12/interacting-efficiently-with-a-restful-service-with-angular2-and-rxjs-part-2/

The order that HTTP requests are added to the ForkJoin is the exact same order the results are returned.

CDF allows you to add HTTP requests in multiple ways:
* *GetList* is an array of GET requests
* *PostList* is an array of POST models

CDF adds requests to the ForkJoin observable in the following oreder:
* *GetList*
* *PostList*

Again, the results returned to your return event handler (onContentReceived) are in the same order the requests are added to the ForkJoin (see above).



___
## MULTIPLE DOMAINS:
CDF supports multiple domains in combining requests into a single Observable block

CDF sees content as the results of making HTTP requests.  It does not care where you get your data for your app.  CDF cares about REST.

You can combine requests to different domains in a given CDF Observable block.

Fork Join Observable is successful if *ALL* requests are successful.  If one of the requests receives a 401 unauthorized response, CDF will attempt to recreate a valid token 3 times before quiting.  

So, in the event a call fails, CDF will take the domain from the URL that failed and lookup the corresponding credentials and attempt to re-establish a valid authentication token.  

If a successful token can be established, then CDF will attept to resubmit each URL in the request.

CDF will attempt the resubmission three times before giving up.


___
## CONFIGURING CDF
cdf-settings.service (/src/cdf-data-island/services/cdf-settings.service.ts) is how you configure ng2-cdf.  It's constructor accepts an array of CdfConfigModel (one for each domain that will be supported).

CdfConfigModel contains the following data elements.  When a request is made to a REST service, CDF uses the domain of the REST request and looks through the CdfConfigModel array based on Domain name to retrieve the credentials necessary to maintain a connection.
``` javascript
	export class CdfConfigModel
	{
		Domain: string;
		ClientKey: string;
		ClientSecret: string;
		Username: string;
		Password: string;
		BaseURL: string;
		Application: string;
	}
```

cdf-settings.service's constructor accepts an array of CdfConfigModel.  The calling application must provide the configuration for cdf-settings.service when the calling app is loaded.  Here's an example:

 ``` javascript
		//ENVIRONMENTAL SETTINGS IN ANGULAR2 (environment.ts)
		export const environment =
		{
			production: false,
			cachePrefix: 'my-site-dev',	
			name: 'My Site - Development',
			version: '2.2.0',
			Domain_Credentials:
			[
				{
					"domain": "api.cloudcms.com",
					"clientKey": "XXXXXXXXXXXXXXXXXXXXX",
					"clientSecret": "XXXXXXXXXXXXXXXXXXXXX",
					"username": "XXXXXXXXXXXXXXXXXXXXX",
					"password": "XXXXXXXXXXXXXXXXXXXXX",
					"baseURL": "https://api.cloudcms.com",
					"application": "XXXXXXXXXXXXXXXXXXXXX"
				},
				{
					"domain": "api.somesite.com",
					"clientKey": "XXXXXXXXXXXXXXXXXXXXX",
					"clientSecret": "XXXXXXXXXXXXXXXXXXXXX",
					"username": "XXXXXXXXXXXXXXXXXXXXX",
					"password": "XXXXXXXXXXXXXXXXXXXXX",
					"baseURL": "https://api.somesite.com",
					"application": "XXXXXXXXXXXXXXXXXXXXX"
				}				
			]	
		};	 


		-------------------------------  config.service.ts:

		import
		{
			CdfConfigModel
		} 								from 'ng2-cdf/lib';

		@Injectable()
		export class ConfigService 
		{		
			/*
			CREATE PROPER CONFIGURATION FOR CONTENT DELIVERY FRAMEWORK (CDF)
			BASED ON REGISTERED DOMAIN'S IN ENVIRONMENT'S Domain_Credentials NODE
			*/
			public static GetDomainCredentials() : CdfConfigModel[]
			{ 
				let configArray: CdfConfigModel[] = [];

				//FIND CONFIG IN LIST WITH SAME DOMAIN NAME
				for (let entry of environment.Domain_Credentials) 
				{
					let domainName = (entry.domain) ? entry.domain : undefined;

					if (domainName)
					{ 
						let domainModel = new CdfConfigModel();
						domainModel.Domain = domainName;
						domainModel.ClientKey = (entry.clientKey) ? entry.clientKey : undefined;
						domainModel.ClientSecret = (entry.clientSecret) ? entry.clientSecret : undefined;
						domainModel.Username = (entry.username) ? entry.username : undefined;
						domainModel.Password = (entry.password) ? entry.password : undefined;
						domainModel.BaseURL = (entry.baseURL) ? entry.baseURL : undefined;
						domainModel.Application = (entry.application) ? entry.application : undefined;

						configArray.push(domainModel);
					}	
				}

				//console.log('configArray:', configArray);
				
				return configArray;
			}
		}

		-------------------------------  shared.module.ts:

		//3RD PARTY...
		import { CdfModule } 				from 'ng2-cdf/lib';
		
		//BUILD DOMAIN CONFIGURATION ARRAY NEEDED FOR CDF MODULE...
		let configArray = ConfigService.GetDomainCredentials();

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
		export class SharedModule
		{
			static forRoot(): ModuleWithProviders
			{
				return {
					ngModule: SharedModule,
					providers:
					[
						.... 
					]
				};
			}
		} 
 ```
