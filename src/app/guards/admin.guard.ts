import { HttpClient } from '@angular/common/http';
import { Injectable, SkipSelf } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ProcessHttpMessageService } from '../services/process-http-message.service';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth:AuthService,private http: HttpClient,
    private processHTTPMsgService:ProcessHttpMessageService,
    private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const currentUser = this.auth.currentUserValue;
      if(currentUser){
          if (currentUser.admin) {
            // authorised so return true
            return true;
        }
      }
    this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
