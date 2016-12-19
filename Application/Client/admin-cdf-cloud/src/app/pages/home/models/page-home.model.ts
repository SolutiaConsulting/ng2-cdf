import { ContentTypeModel }			from '../../../shared/models/index';

import { 
	CdfTweetModel,
	CdfYouTubeModel
} 									from 'ng2-cdf/lib';

export class PageHomeModel
{
	ContentList: ContentTypeModel[] = [];

	constructor(rawJsonTweets: any, rawJsonYouTube: any)
	{
		//TWITTER DATA
		for (let entry of rawJsonTweets) 
		{
			this.ContentList.push(new ContentTypeModel('CdfTweetComponent', 'tweetModel', new CdfTweetModel(entry), false));
		}

		//YOUTUBE DATA
		if(rawJsonYouTube && rawJsonYouTube.items)
		{
			for (let entry of rawJsonYouTube.items) 
			{				
				this.ContentList.push(new ContentTypeModel('CdfYouTubeComponent', 'youTubeModel', new CdfYouTubeModel(entry), true));
			}
		}				

		//this.shuffle(this.ContentList);
		this.sort(this.ContentList);
	}

	private shuffle(array) 
	{
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}	


	private sort(array) 
	{
		// SEE INDEX.HTML PAGE FOR DIFFERENT SORT PROTOTYPES
		return array.sortByDesc(function(o){ return o.Value.TimeStamp });
	}		
}