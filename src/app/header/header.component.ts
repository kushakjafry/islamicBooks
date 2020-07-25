import { Component, OnInit,TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  
  show = false;
  username: string = undefined;
  subscription: Subscription;

  constructor(public dialog:MatDialog,
    private authService: AuthService) {
    
   }
  
  ngOnInit(): void {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(name => { console.log(name); this.username = name; });
  }
  isCollapsed = true;

  openLoginForm() {
    const loginRef = this.dialog.open(LoginComponent, {width: '500px', height: '450px'});
    loginRef.afterClosed()
    .subscribe(result => {
      console.log(result);
    });
}


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logOut() {
    this.username = undefined;
    this.authService.logOut();
  }

    open() {
    if(this.show === false)
    this.show = true;
    else{
      this.show = false;
    }
  }
  
  openSignupForm(){
    const SignupRef = this.dialog.open(SignupComponent,{width: '500px',height:'450px'});
  }


}
