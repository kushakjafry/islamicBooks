import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resolveTypeReferenceDirective, updateShorthandPropertyAssignment } from 'typescript';
import { ConfirmationService } from '../services/confirmation.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  query:String;
  errMess:String;
  successMess:String;
  constructor(private Activatedroute:ActivatedRoute,
    private confirmationService:ConfirmationService,
    private router:Router,
    private auth:AuthService) {}

  ngOnInit(): void {
  this.Activatedroute.queryParamMap
    .subscribe(params => {
      this.query = params.get('q');
      this.confirmationService.confirmAccount(this.query)
      .subscribe((data:any) => {
        if(data.success){
          this.successMess = "success";
          var credentials = {username:data.username,token:data.token}
          this.auth.storeUserCredentials(credentials);
          setTimeout(() => {
            this.router.navigateByUrl('home');
          }, 2000);
        }
      },errmess => this.errMess = errmess)
    },errmess => this.errMess = errmess);
  }

}
