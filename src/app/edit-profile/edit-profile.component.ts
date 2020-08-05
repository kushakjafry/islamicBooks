import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { faInfoCircle, faKey, faLock, faUserCircle,faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';
import { FooterService } from '../services/footer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  faUserCircle=faUserCircle;
  changePassword:boolean = false;
  faUserGraduate = faUserGraduate;
  faInfoCircle = faInfoCircle;
  faLock = faLock;
  faKey=faKey;
  successMess:string;
  errMess:string;
  @ViewChild('pform') profileFormDirective;
  User:any;
  showForm:boolean = true;
  profileForm:FormGroup;
  formErrors = {
    'fullname': '',
  };
  genderType = [{
    type:"M",
    name:'Male'
  },
  {
    type:"F",
    name:"Female"
  },
  {
    type:"others",
    name:"Dont want to state"
  }]

  validationMessages = {
    'fullname': {
      'required': 'name is required.'
    }
  };
  dismissible = false;
  defaultAlerts: any = {
    type: 'danger',
    msg : ''
  }
  alerts = this.defaultAlerts;
 
  reset(): void {
    this.alerts = this.defaultAlerts;
  }

  constructor(private footer:FooterService,private fb:FormBuilder,
    private router:ActivatedRoute,private userService:UserService) { }

  ngOnInit(): void {
    this.footer.hide();
    this.router.params.pipe(switchMap((params:Params) => {return this.userService.getUser(params['username'])}))
    .subscribe((data) => {
      this.User = data;
      this.createForm();
    },err=>{this.errMess = err;this.alerts.type ="danger";this.alerts.msg="User cannot be found on server"})
  }
  ngOnDestroy(): void {
    this.footer.show();
  }
  createForm(){
    this.profileForm = this.fb.group({
      'fullname':[this.User.username,Validators.required],
      'profession':[this.User.profession],
      'bio':[this.User.bio],
      'gender':[this.User.gender],
      'oldpassword':[''],
      'newpassword':['']
    })
    this.profileForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  }

  onValueChanged(data?: any) {
    console.log(this.profileForm.value)
    if (!this.profileForm) { return; }
    const form = this.profileForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
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
    this.showForm = false;
    this.userService.updateUser(this.profileForm.value,this.User.username)
    .subscribe((data) => {
      this.User = data;
      this.showForm = true;
      this.alerts.type = "success";
      this.alerts.msg = "Updated the profile";
    },err=> {this.errMess = err,this.showForm = true;this.alerts.type="danger";this.alerts.msg="Failed to update the profile plz provide right credentials"})
  }
  passwordchange(){
   this.changePassword = true;
  }
}
