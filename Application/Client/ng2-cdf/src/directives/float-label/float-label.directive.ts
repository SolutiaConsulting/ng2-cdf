//BASED ON:
// - http://richardvenneman.github.io/floatl/example/
// - https://ui8.net/account/signin

import {
	Directive,
	ElementRef,
	OnInit,
	OnDestroy
} 								from '@angular/core';

@Directive({
    selector: '[floatLabel]'
})
export class FloatLabelDirective implements OnInit, OnDestroy
{
	private elementRef: ElementRef;

	floatContainerClass = 'floatLabelContainer';
	floatTextAreaClass = 'floatLabelContainer__textarea';
	animateClass = 'animate';
	floatLabelClass = 'floatLabelContainer__label';
	floatInputClass = 'floatLabelContainer__input';
	focusedClass = 'floatLabelContainer--focused';
	hasValueClass = 'floatLabelContainer--hasValue';
	nativeElement: any;
	labelElement: any;
	formElement: any;

    constructor(element: ElementRef) 
	{
		this.elementRef = element;
	};

    ngOnInit(): void
    {
		this.nativeElement = this.elementRef.nativeElement;
		this.labelElement = this.nativeElement.querySelector('label');
		this.formElement = this.nativeElement.querySelector('input') || this.nativeElement.querySelector('textarea');

		// console.log('elementRef:', this.elementRef);
		// console.log('nativeElement:', this.elementRef.nativeElement);
		// console.log('labelElement', this.labelElement);
		// console.log('formElement', this.formElement);
		// console.log('------------------------------------------------------------');

		//SET CLASSES TO APPLY FLOATING LABEL		
		this.addClass(this.nativeElement, this.floatContainerClass);
		this.addClass(this.nativeElement, this.animateClass);
		this.addClass(this.labelElement, this.floatLabelClass);
		this.addClass(this.formElement, this.floatInputClass);

		//IF TEXTAREA, THEN APPLY CLASS SPECIFIC FOR TEXTAREAS		
		if (this.nativeElement.querySelector('textarea')) 
		{
			this.addClass(this.nativeElement, this.floatTextAreaClass);
		}

		this.bindListeners();
    };

    ngOnDestroy(): void
    {
		this.removeEventListener(this.formElement, 'focus');
		this.removeEventListener(this.formElement, 'blur');
    };

	private bindListeners()
	{
		this.addEventListener(this.formElement, 'focus', () => 
		{
			this.addClass(this.nativeElement, this.focusedClass);
		});

		this.addEventListener(this.formElement, 'blur', () => 
		{
			if (this.formElement.value === '') 
			{
				this.removeClass(this.nativeElement, this.focusedClass);
				this.removeClass(this.nativeElement, this.hasValueClass);				
			}
			else
			{
				this.removeClass(this.nativeElement, this.focusedClass);
				this.addClass(this.nativeElement, this.hasValueClass);
			}			
		});
	};

	private addEventListener(element, eventName, handler) 
	{
		if (element)
		{
			if (element.addEventListener) 
			{
				element.addEventListener(eventName, handler);
			}
			else
			{
				element.attachEvent(`on%{eventName}`, function () 
				{
					handler.call(element);
				});
			}
		}
	};

	private removeEventListener(element, eventName) 
	{
		if (element && element.removeEventListener) 
		{
			element.removeEventListener(eventName);
		}
	};

	private addClass(element, className) 
	{
		if (element.classList) 
		{
			element.classList.add(className);
		}
		else
		{
			element.className += ` %{className}`;
		}
	};

	private removeClass(element, className) 
	{
		if (element.classList) 
		{
			element.classList.remove(className);
		}
		else
		{
			let re = new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi');
			element.className = element.className.replace(re, ' ');
		}
	};
}