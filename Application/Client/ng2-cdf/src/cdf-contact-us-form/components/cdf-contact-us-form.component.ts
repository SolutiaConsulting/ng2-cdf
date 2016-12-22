import
{
	AfterViewInit,
	Component,
	EventEmitter,
	OnInit,
	Output
} 										from '@angular/core';
import
{
	FormBuilder,
	FormGroup,
	Validators
} 										from '@angular/forms';

import 
{ 
	CdfContactUsFormModel,
	EmailValidator 
}										from '../models/index';


@Component({
	selector: 'cdf-youtube',
	template: 
	`	
	<form [formGroup]="contactUsForm" (ngSubmit)="onFormSubmit()" novalidate autocomplete="off">
		<section class="grid-block">
			<section class="grid-block vertical">
				<!--NAME-->
				<section class="grid-block">
					<div floatLabel class="form-element">
						<label>Name</label>
						<input type="text" formControlName="name"/>
						<div [hidden]="contactUsForm.controls.name.valid || contactUsForm.controls.name.pristine" class="form-element__error">
							name is required
						</div>													
					</div>
				</section>

				<!--EMAIL ADDRESS-->
				<section class="grid-block">
					<div floatLabel class="form-element">
						<label>Email Address</label>
						<input type="email" formControlName="emailAddress"/>
						<div [hidden]="contactUsForm.controls.emailAddress.valid || contactUsForm.controls.emailAddress.pristine || !contactUsForm.controls.emailAddress.errors.required" class="form-element__error">
							email address is required
						</div>						
						<div [hidden]="contactUsForm.controls.emailAddress.valid || contactUsForm.controls.emailAddress.pristine || !contactUsForm.controls.emailAddress.errors.email" class="form-element__error">
							invalid email address
						</div>
					</div>
				</section>

				<!--MESSAGE-->
				<section class="grid-block">
					<div floatLabel class="form-element">
						<label>Message:</label>
						<textarea formControlName="message"></textarea>
						<div [hidden]="contactUsForm.controls.message.valid || contactUsForm.controls.message.pristine" class="form-element__error">
							message is required
						</div>					
					</div>
				</section>

				<!--BUTTON-->
				<section class="grid-block align-center">
					<button type="submit" class="button large radius" [disabled]="!contactUsForm.valid">Send Your Message</button>
				</section>
			</section>
		</section>
	</form>	
	`,
	styles: [ 
		`		
		` ],
	providers: []
})
export class CdfContactUsFormComponent implements OnInit, AfterViewInit
{	
	contactUsForm: FormGroup;

	@Output() NotifyFormSubmitted = new EventEmitter<CdfContactUsFormModel>();

	constructor
	(
		private formBuilder: FormBuilder
	)
	{
	}

	ngOnInit()
	{
		this.contactUsForm = this.formBuilder.group
			({
				name: [ '', Validators.required ],
				emailAddress: [ '', [Validators.required, EmailValidator.email] ],
				message: [ '', Validators.required ]
			});

		this.contactUsForm.valueChanges
			.map((value) =>
			{
				value.name = value.name.toUpperCase();
				return value;
			})
			//.filter((value) => this.contactUsForm.valid)
			.subscribe((value) =>
			{
				console.log('name errors:', this.contactUsForm.controls['name']);
				console.log("Model Driven Form valid value:", JSON.stringify(value));
			});		
	}

	ngAfterViewInit()
	{
	}

	onFormSubmit()
	{ 
		let formModel: CdfContactUsFormModel;
		formModel.Name = this.contactUsForm.controls['name'].value;
		formModel.EmailAddress = this.contactUsForm.controls['emailAddress'].value;
		formModel.Message = this.contactUsForm.controls['message'].value;

		console.log('DAS FORM ERRORS', this.contactUsForm.controls[ 'name' ].errors);
		console.log('DAS FORM ERRORS', this.contactUsForm.controls[ 'emailAddress' ].errors);
		console.log('DAS FORM ERRORS', this.contactUsForm.controls[ 'message' ].errors);	
		console.log('DAS FORM YO1....', this.contactUsForm.value);
		console.log('DAS FORM YO2....', formModel);

		//NOTIFY DESKTOP PARENT COMPONENT OF HERO MEDIA FEATURE FROM CMS...
		this.NotifyFormSubmitted.emit(formModel);	
	}	
}