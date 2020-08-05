import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';
import { FooterService } from '../services/footer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  faEdit=faEdit;
  User:any;
  defaultAlerts: any = {
    type: 'danger',
    msg : ''
  }
  alerts = this.defaultAlerts;
 
  reset(): void {
    this.alerts = this.defaultAlerts;
  }
  errMess:string;
  constructor(private router:ActivatedRoute,private footer:FooterService,
    private userService:UserService,private route:Router) { }

  ngOnInit(): void {
    this.footer.hide();
    this.router.params.pipe(switchMap((params:Params) => {return this.userService.getUser(params['username'])}))
    .subscribe((data) => {
      this.User = data;
    })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.footer.show();
  }
  deleteAccount(){
    if(confirm('Are you sure you want to delete '+this.User.username+' account')){
      this.userService.deleteAccount(this.User.username)
    .subscribe((data) => {
      this.route.navigate(['/home']);
    },(err) => {this.errMess = err;this.alerts.type="danger";this.alerts.msg="Cannot delete the account"})
    }
  }
  alertDismiss(){
    this.errMess = null;
  }
}
