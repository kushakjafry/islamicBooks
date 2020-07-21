import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialogRef, MatDialog} from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginFormDirective;

  user = {username: '', password: '', remember: false};
  errMess: string;
  hideForm:boolean = false;

  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    public dialog: MatDialog,
    private authService: AuthService) { }

  ngOnInit() {
  }

  dismissible = false;
  defaultAlerts: any = {
    type: 'danger',
    msg : ''
  }
  alerts = this.defaultAlerts;
 
  reset(): void {
    this.alerts = this.defaultAlerts;
  }
 

  onSubmit() {
    this.hideForm = true;
    console.log('User: ', this.user);
    this.authService.logIn(this.user)
      .subscribe(res => {
        this.hideForm = false;
        if (res.success) {
          this.dialogRef.close(res.success);
        } else {
          console.log(res);
        }
      },
      error => {
        this.hideForm = false;
        console.log(error);
        this.user = {username: '', password: '', remember: false};
        if(error.indexOf('401') !== -1) {
          this.defaultAlerts.msg = 'Oops! Incorrect Password/Email or Email not confirmed';
        }else{
          this.defaultAlerts.msg = 'Oops! Server Error please login after sometime';
        }
        this.loginFormDirective.resetForm();
        this.errMess = error;
      });
  }

  openSignupForm(){
    const SignupRef = this.dialog.open(SignupComponent,{width: '500px',height:'450px'});
    SignupRef.afterClosed()
    .subscribe(() => this.dialogRef.close())
  }

}
