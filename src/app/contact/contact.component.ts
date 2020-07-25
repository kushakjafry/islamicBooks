import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Feedback } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  feedbackForm: FormGroup;
  @ViewChild('feedbackform') feedbackFormDirective;
  contactType = [{
    type:'None',
    icon:'times'
  },{
    type: 'Tel No.',
    icon: 'phone'
  },{
    type: 'Email',
    icon:'envelope'
  }]
  feedback: Feedback;
  showForm: Boolean = true;
  submitted = null;
  errMess: String;
  alert:any = {
    type:'',
    msg:''
  }

  formErrors = {
    'firstname':'',
    'lastname': '',
    'telnum': '',
    'email': ''
  }

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };


  constructor(private fb:FormBuilder,
    private feedbackservice:FeedbackService) { 
    this.createForm();
  }
  
  ngOnInit(): void {
    
  }

  createForm(){
    this.feedbackForm = this.fb.group({
      'firstname': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      'lastname': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      'telnum': ['', [Validators.required, Validators.pattern] ],
      'email': ['', [Validators.required, Validators.email] ],
      'agree': false,
      'contacttype': 'None',
      'message': ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?:any){
    console.log(this.feedbackForm.value)
    if(!this.feedbackForm) return;
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.showForm = false;
    this.feedbackservice.postFeedback(this.feedback)
      .subscribe(feedback => {
         this.submitted = feedback;
         this.feedback = null;
         setTimeout(() => { this.submitted = null; this.showForm = true; this.alert.type="success";this.alert.msg = "Feedback Sent";this.errMess = 'Registered' }, 5000);
        },
        error => {
          this.showForm = true;
          this.alert.type = "danger";
          this.alert.msg = "Submission failed";
          this.errMess = error;
        });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
  

}
