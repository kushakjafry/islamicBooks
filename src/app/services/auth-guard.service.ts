import { Injectable } from '@angular/core';
import { Router,CanActivate } from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }

  canActivate(): boolean {
    var token = JSON.parse(localStorage.getItem('JWT'));
    console.log(token);
    if(!token){
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }

}
