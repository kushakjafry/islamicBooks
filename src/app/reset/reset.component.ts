import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ResetService } from '../services/reset.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  @ViewChild('resetform') resetformDirective;
  resetForm:FormGroup;
  successMess:String;
  formErrors= {
    password:'',
    confirmPassword:''
  }
  validationMessages = {
    'password':{
      'required':'Password is required'
    },
    'confirmPassword':{
      'required':'Confirm password is required'
    }
  }
  errMess: string;
  query:String;
  hideForm:boolean = false;
  defaultAlerts: any = {
    type: 'danger',
    msg : ''
  }
  alerts = this.defaultAlerts;

  constructor(private fb:FormBuilder,
    private resetService:ResetService,
    private Activatedroute:ActivatedRoute,
    private router:Router,
    private auth:AuthService) { 
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.resetForm = this.fb.group({
      'password':[{value:'',disabled:this.hideForm},Validators.required],
      'confirmPassword': [{value:'',disabled:this.hideForm},Validators.required]
    })
    this.resetForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?:any){
    console.log(this.resetForm.value)
    if(!this.resetForm) return;
    const form = this.resetForm;
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

  onSubmit(){
    this.hideForm = true;
    if(this.resetForm.value.password !== this.resetForm.value.confirmPassword){
      this.alerts.type = 'danger';
      this.alerts.msg = 'Password and confirm passsword not matching';
      this.errMess = 'failed not matching';
      this.hideForm = false;
      return;
    }
    this.Activatedroute.queryParamMap
    .subscribe(params => {
      this.query = params.get('q');
      this.resetService.ResetPassword(this.resetForm.value,this.query)
      .subscribe((data:any) => {
        if(data.success){
          this.alerts.type="success";
          this.alerts.msg = "Password reset. Redirecting to home ...";
          this.successMess = "success";
          var credentials = {username:data.username,token:data.token}
          this.auth.storeUserCredentials(credentials);
          setTimeout(() => {
            this.hideForm = false;
            this.resetForm.reset({
              password:'',
              confirmPassword:''
            })
            this.resetformDirective.resetForm();
            this.router.navigateByUrl('home');
          }, 2000);
        }
      },err => {
        if(err.indexOf('404') !== -1){
          this.alerts.type = 'danger';
          this.alerts.msg = "Reset Token expired"
        }else{
          this.alerts.type = 'danger';
          this.alerts.msg = 'Invalid Token.'
        }
        this.errMess = err;
        this.hideForm = false;
        this.resetForm.reset({
          password:'',
          confirmPassword:''
        })
        this.resetformDirective.resetForm();
      })
    },(err) => this.errMess = err)
  }
  
  alertDismiss(){
    this.errMess = null;
    this.successMess = null;
  }
}
