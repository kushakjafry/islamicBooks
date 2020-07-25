import { Component, OnInit } from '@angular/core';
import { ForgotService } from '../services/forgot.service';


@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  user = {email: ''};
  errMess: string;
  defaultAlerts: any = {
    type: '',
    msg : ''
  }
  alerts = this.defaultAlerts;
  hideForm:Boolean = false;
  successMess:String;

  constructor(private forgotService:ForgotService) {}

  ngOnInit(): void {
  }

  onSubmit() {
    this.hideForm = true;
    this.forgotService.forgotEmail(this.user)
    .subscribe(res => {
      this.hideForm = false;
      this.alerts.type = 'info',
      this.alerts.msg = 'Email has been sent to '+this.user.email+' with further instruction';
      this.successMess = 'success';
    },err => {
      console.log(err);
      this.alerts.type = 'danger';
      if(err.indexOf('404') !== -1){
        this.alerts.msg = 'Email not found';
      }else{
        this.alerts.msg = 'Internal Server Error';
      }
      this.hideForm = false;
      this.errMess = err;
    })
  }
}
