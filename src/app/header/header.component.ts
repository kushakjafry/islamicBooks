import { Component, OnInit,TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NavbarService } from '../services/navbar.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers : [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {

  
  show = false;
  username: string = undefined;
  subscription: Subscription;
  caretStyle:string = 'down';
  isAdmin:Boolean = false;
  adminSubscription: Subscription;


  constructor(public dialog:MatDialog,
    private authService: AuthService,
    public nav:NavbarService) {
    
   }
  
  ngOnInit(): void {
    this.authService.loadUserCredentials();
    this.subscription = this.authService.getUsername()
      .subscribe(name => { console.log(name); this.username = name; });
    this.adminSubscription = this.authService.getAdmin()
    .subscribe(admin => this.isAdmin = admin);
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
    this.adminSubscription.unsubscribe();
  }

  logOut() {
    this.username = undefined;
    this.isAdmin = false;
    this.caretStyle = 'down';
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
  items: string[] = [
    this.username,
    'My profile',
    'Logout'
  ];
 
  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    if(this.caretStyle === 'down'){
      this.caretStyle = 'up';
    }else if(this.caretStyle === 'up'){
      this.caretStyle = 'down';
    }
  }


}
