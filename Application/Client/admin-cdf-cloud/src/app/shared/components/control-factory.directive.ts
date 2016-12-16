import { 
	Directive, 
	Component, 
	ComponentFactory, 
	OnChanges, 
	Input, 
	ViewContainerRef,
	Compiler,
	ComponentFactoryResolver,
	Type
 } 								from '@angular/core';

 import { ContentTypeModel }	from '../models/index';

@Directive({
  selector: '[ctrl-factory]'
})
export class ControlFactoryDirective implements OnChanges 
{
	@Input() contentTypeModel: ContentTypeModel

	componentRef;
	init = false;

	constructor(
		private vcRef: ViewContainerRef, 
		private resolver: ComponentFactoryResolver
	) 
	{ 
	}

	ngOnChanges() 
	{
		if (!this.contentTypeModel || this.init) return;

		let factories = Array.from(this.resolver['_factories'].keys());
		var factoryClass = <Type<any>>factories.find((x: any) => x.name === this.contentTypeModel.ComponentName);

		// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  COMPONENT MODEL:', this.contentTypeModel);
		// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  FACTORIES YO:', factories);
		// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  FACTORY CLASS:', factoryClass);		
		
		if(factoryClass)
		{
			const factory = this.resolver.resolveComponentFactory(factoryClass);
			const compRef = this.vcRef.createComponent(factory);

			compRef.instance[this.contentTypeModel.Key] = this.contentTypeModel.Value;

			// if(this.inputs)
			// {
			// 	for (let entry of this.inputs) 
			// 	{
			// 		if (entry && entry.key && entry.value)
			// 		{ 
			// 			compRef.instance[entry.key] = entry.value;
			// 		}	
			// 	}		
			// }
			
			// console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%  COMPONENT INSTANCE:', compRef.instance);

			if (this.componentRef) 
			{
				this.componentRef.destroy();
			}

			this.componentRef = compRef;
			this.init = true;
		}
	}

	public ngOnDestroy()
	{
		if (this.componentRef) 
		{
			this.componentRef.destroy();
			this.componentRef = null;
		}
	}
}

