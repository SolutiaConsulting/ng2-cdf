# CONTENT DELIVERY FRAMEWORK (CDF)

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
## **_cdfRequestModel_**:
cdfRequestModel is the class used for gathering the GETs and POSTs http requests that will be called as a single Observable block
``` javascript
export class cdfRequestModel
{
	GetList: string[]; 
	PostList: cdfPostModel[];

	constructor()
	{
	}
}
```

* *GetList* is an array of GET requests
* *PostList* is an array of POST models


## **_cdfPostModel_**:
cdfPostModel is the class describing the data elements needed for a proper POST
``` javascript
export class cdfPostModel
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
	import { cdfPostModel, cdfRequestModel } 	from '../../../cdf-data-island/index';	

	@Component({
		selector: 'some-cool-custom-tag',
		templateUrl: './some-cool-custom-tag.component.html',
		styleUrls: [ './some-cool-custom-tag.component.less' ],
		providers: []
	})
	export class SomeCoolCustomComponent implements OnInit
	{
		RequestModel = new cdfRequestModel();

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
				new cdfPostModel
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
	<cdf-data-island [RequestData]="RequestModel" (onContentReceived)="onContentReceived($event)"></cdf-data-island>

	<section>
		/* DISPLAY HTML HERE CONSUMING JSON RESULTS FROM CDF-DATA-ISLAND */
	</section>

```
CDF-DATA-ISLAND ATTRIBUTES:
* *RequestData* is RequestModel data type (see below) containing GETs and POSTs that are called as a single Observable block
* *(onContentReceived)* is the event binding that is called when results are returned for each call in Observable block 	


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

You can combine requests to different domains in a given CDF Observable block.  You configure your different domains in cdf-settings.ts

Fork Join Observable is successful if *ALL* requests are successful.  If one of the requests receives a 401 unauthorized response, CDF will attempt to recreate a valid token 3 times before quiting.  

You can register domain credentials in cdf-settings.ts

``` javascript
	/*
	LIST OF CREDENTIALS BY DOMAIN NAME

	AFFORDS ABILITY TO SUPPORT MULTIPLE DOMAINS...
	 */
	public static DOMAIN_CREDENTIALS =
	{
		"api.cloudcms.com":
		{
			"baseURL": "https://api.cloudcms.com",
			"application": "application key value",
			"clientKey": "client key value",
			"clientSecret": "client secret",
			"username": "username",
			"password": "hashed password"
		}
	};
```

So, in the event a call fails, CDF will take the domain from the URL that failed and lookup the corresponding credentials and attempt to re-establish a valid authentication token.  

If a successful token can be established, then CDF will attept to resubmit each URL in the request.

CDF will attempt the resubmission three times before giving up.