import { Component, OnInit,TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SignupComponent } from '../signup/signup.component';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { NavbarService } from '../services/navbar.service';
import { faHome,faPhone,faList,faBook,faInfo,faUserPlus,faSignInAlt,faCaretDown,faCaretUp,faSignOutAlt,faUser } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers : [{ provide: BsDropdownConfig, useValue: { isAnimated: true, autoClose: true } }]
})
export class HeaderComponent implements OnInit {
  faHome = faHome;
  faPhone= faPhone;
  faList=faList;
  faBook=faBook;
  faInfo=faInfo;
  faUserPlus=faUserPlus;
  faSignInAlt=faSignInAlt;
  faCaretDown=faCaretDown;
  faCaretUp=faCaretUp;
  faCaret = faCaretDown;
  faSignOutAlt=faSignOutAlt;
  faUser=faUser;
  
  show = false;
  username: string = undefined;
  subscription: Subscription;
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
    const loginRef = this.dialog.open(LoginComponent, {width: '500px', height: '600px'});
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
    this.faCaret = faCaretDown;
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
    const SignupRef = this.dialog.open(SignupComponent,{width: '500px',height:'600px'});
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
    if(this.faCaret === faCaretDown){
      this.faCaret = faCaretUp;
    }else if(this.faCaret === faCaretUp){
      this.faCaret = faCaretDown;
    }
  }


}
