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
	selector: 'cdf-contact-us-form',
	template: 
	`	
	<form [formGroup]="contactUsForm" (ngSubmit)="onFormSubmit($event)" novalidate autocomplete="off">
		<!--NAME-->
		<section class="row">
			<div class="column">
				<div floatLabel class="form-element">
					<label>Name</label>
					<input type="text" formControlName="name"/>
					<div [hidden]="contactUsForm.controls.name.valid || contactUsForm.controls.name.pristine" class="form-element__error">
						name is required
					</div>													
				</div>
			</div>
		</section>

		<!--EMAIL ADDRESS-->
		<section class="row">
			<div class="column">
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
			</div>				
		</section>

		<!--MESSAGE-->
		<section class="row">
			<div class="column">
				<div floatLabel class="form-element">
					<label>Message:</label>
					<textarea formControlName="message"></textarea>
					<div [hidden]="contactUsForm.controls.message.valid || contactUsForm.controls.message.pristine" class="form-element__error">
						message is required
					</div>					
				</div>
			</div>
		</section>

		<!--BUTTON-->
		<section class="row align-center">
			<div class="column">
				<button type="submit" class="button large radius" [disabled]="!contactUsForm.valid">Send Your Message</button>
			</div>
		</section>
	</form>	
	`,
	styles: [ 
		`		
form {
    margin: 0;
    width: 100%
}

form input,
form select,
form textarea {
    background-color: transparent;
    border: 0;
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
    border-radius: 0;
    box-sizing: border-box;
    color: #262626;
    display: block;
    font-size: 1.25rem;
    height: 2.3125rem;
    margin: 0;
    padding: 0 .5rem;
    transition: border-color .15s ease-in-out 0s, box-shadow .15s ease-in-out 0s;
    width: 100%
}

form input:focus,
form input:hover,
form select:focus,
form select:hover,
form textarea:focus,
form textarea:hover {
    border: 0;
    outline: 0
}

form .form-element__error {
    color: #B5121B;
    padding: 0 .75rem
}

.ng-valid[required] {
    border-left: 5px solid #598920
}

form input.ng-dirty.ng-invalid,
form select.ng-dirty.ng-invalid,
form textarea.ng-dirty.ng-invalid {
    border-left: 5px solid #B5121B
}

.floatLabelContainer {
    width: 100%;
    height: 70px;
    margin: 0 0 40px;
    background: #fff;
    box-sizing: border-box;
    border: 1px solid rgba(42, 42, 42, .3);
    border-radius: .325rem;
    position: relative
}

.floatLabelContainer__textarea {
    height: 280px
}

.floatLabelContainer.animate label {
    -webkit-transition: all .9s ease;
    transition: all .9s ease
}

.floatLabelContainer__label {
    box-sizing: border-box;
    color: #AFAFAF;
    font-size: 12px;
    font-weight: 400;
    height: 100%;
    line-height: 70px;
    opacity: 1;
    padding: 0 20px;
    pointer-events: none;
    position: absolute;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    width: 100%
}

.floatLabelContainer__input {
    -webkit-appearance: none!important;
    -moz-appearance: none!important;
    appearance: none!important;
    background: 0 0!important;
    box-sizing: border-box;
    color: #262626!important;
    height: 100%!important;
    margin: 0!important;
    outline: 0!important;
    padding: 10px 20px 0!important;
    width: 100%!important
}

.floatLabelContainer__input::selection {
    color: #fff;
    background-color: #2a8dea
}

.floatLabelContainer--focused,
.floatLabelContainer__input:focus {
    border-color: #2a8dea
}

.floatLabelContainer--focused .floatLabelContainer__label {
    color: #2a8dea;
    transform: translate3d(0, -20px, 0)
}

.floatLabelContainer--hasValue .floatLabelContainer__label {
    transform: translate3d(0, -20px, 0)
}

.floatLabelContainer>textarea {
    padding: 30px 20px 0!important
}	
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
		this.CreateForm();

		this.contactUsForm.valueChanges
			.map((value) =>
			{
				value.name = value.name.toUpperCase();
				return value;
			})
			//.filter((value) => this.contactUsForm.valid)
			.subscribe((value) =>
			{
				//console.log('name errors:', this.contactUsForm.controls['name']);
				//console.log("Model Driven Form valid value:", JSON.stringify(value));
			});		
	}

	ngAfterViewInit()
	{
	}

	onFormSubmit(e)
	{ 
		e.preventDefault();

		let formModel: CdfContactUsFormModel = new CdfContactUsFormModel();
		formModel.Name = this.contactUsForm.controls['name'].value;
		formModel.EmailAddress = this.contactUsForm.controls['emailAddress'].value;
		formModel.Message = this.contactUsForm.controls['message'].value;

		// console.log('DAS FORM ERRORS', this.contactUsForm.controls[ 'name' ].errors);
		// console.log('DAS FORM ERRORS', this.contactUsForm.controls[ 'emailAddress' ].errors);
		// console.log('DAS FORM ERRORS', this.contactUsForm.controls[ 'message' ].errors);	
		// console.log('DAS FORM YO1....', this.contactUsForm.value);
		// console.log('DAS FORM MODEL....', formModel);

		//NOTIFY DESKTOP PARENT COMPONENT OF HERO MEDIA FEATURE FROM CMS...
		this.NotifyFormSubmitted.emit(formModel);	
	}	

	ResetForm()
	{
		this.CreateForm();
	}


	CreateForm()
	{
		this.contactUsForm = this.formBuilder.group
			({
				name: [ '', Validators.required ],
				emailAddress: [ '', [Validators.required, EmailValidator.email] ],
				message: [ '', Validators.required ]
			});
	}
}