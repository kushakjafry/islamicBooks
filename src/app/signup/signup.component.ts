import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialogRef, MatDialog} from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { faEnvelope,faLock,faUser } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  faEnvelope=faEnvelope;
  faLock = faLock;
  faUser = faUser;

  @ViewChild('signupForm') signUpFormDirective;
  signup = {fullname:'',username:'',password:''};
  errMess: string;
  user = { username: '', password: ''};
  alert : any = {
    type:'',
    msg:''
  };
  hideForm:Boolean = false;


  constructor(private authService:AuthService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SignupComponent>) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.hideForm = true;
    this.user.username = this.signup.username;
    this.user.password = this.signup.password;
    console.log('User: ', this.signup);
    this.authService.signUp(this.signup)
      .subscribe(res => {
        this.hideForm = false;
        if (res.success) {
          console.log(res);
          this.alert.type="info";
          this.alert.msg="Email Sent !! Please Confirm Your Email";
          this.errMess = "success";
        } else {
          console.log(res);
        }
      },
      error => {
        this.hideForm = false;
        console.log(error);
        if(error.indexOf(500) !== -1){
          this.alert.msg = "Username Exists";
          this.alert.type= "danger";
        }else{
          this.alert.msg = "Sever Error please visit after some time";
          this.alert.type = "danger";
        }
        this.errMess = error;
        this.signup = {fullname:'',username:'',password:''};
        this.signUpFormDirective.resetForm();
      });
  }


}
