export class ContentTypeModel
{
	ComponentName: string;
	Key: string;
	Value: any;
	HasVideo: boolean;

	constructor(
		componentName: string, 
		key: string, 
		value: any, 
		hasVideo: boolean
	)
	{
		this.ComponentName = componentName;
		this.Key = key;
		this.Value = value;
		this.HasVideo = hasVideo;
	}
}