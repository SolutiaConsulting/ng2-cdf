import { Injectable } 		from '@angular/core';
import { BehaviorSubject } 	from 'rxjs/BehaviorSubject';
import { Observable } 		from 'rxjs/Rx';

@Injectable()
export class OnlineService 
{
	private isOnline = new BehaviorSubject<boolean>(false);
	
	// Observable 'IsLoading' stream
	//subscribers are notified when isLoading changes
	IsOnlineStream = this.isOnline.asObservable();

	constructor()
	{
		let that = this;
		let interval = 1000;
		let timeOuts = []; 

		if ('onLine' in navigator) 
		{
			(function checkStatus() 
			{
				timeOuts["uniqueId"] = setTimeout
				(
					function () 
					{
						//console.log('IS ONLINE:', navigator.onLine);

						that.isOnline.next(navigator.onLine);

						clearTimeout(timeOuts["uniqueId"]);
						checkStatus();
					}, interval
				);
			})();
		}
	}
}