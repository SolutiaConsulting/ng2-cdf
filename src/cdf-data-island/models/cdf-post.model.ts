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