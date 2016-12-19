export class BreadcrumbModel
{
	Name: string;
	Title: string;
	OnClick: Function = undefined;
	
	constructor(name: string, title: string, onClick:Function)
	{
		this.Name = name;
		this.Title = title;

		if (typeof onClick === "function")
		{ 
			this.OnClick = onClick;
		}	
	}

	DoClick()
	{ 
		if (typeof this.OnClick === "function")
		{ 
			this.OnClick();
		}
	};
}