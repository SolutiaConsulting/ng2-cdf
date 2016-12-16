import { Injectable } from '@angular/core';

import hash from 'object-hash/dist/object_hash';

@Injectable()
export class CompareService 
{
	constructor()
	{

	}

	IsSmame(object1: Object, object2: Object) : boolean
	{
		let object1Hash = hash(object1);
		let object2Hash = hash(object2);

		// console.log('object1Hash', object1Hash);
		// console.log('object2Hash', object2Hash);

		return (object1Hash === object2Hash);
	};
}