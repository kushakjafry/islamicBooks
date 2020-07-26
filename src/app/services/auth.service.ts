import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { baseURL } from '../shared/baseurl';
import { ProcessHttpMessageService } from './process-http-message.service';

interface AuthResponse {
  status: string;
  success: string;
  token: string;
  admin:boolean;
}

interface SignUpResponse {
  success: string,
  status: string
}

interface JWTResponse {
  status: string;
  success: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenKey = 'JWT';
  isAuthenticated: Boolean = false;
  username: Subject<string> = new Subject<string>();
  authToken: string = undefined;
  admin: Subject<boolean> = new Subject<boolean>();

   constructor(private http: HttpClient,
     private processHTTPMsgService: ProcessHttpMessageService) {
   }

   checkJWTtoken() {
     this.http.get<JWTResponse>(baseURL + 'users/checkJWTtoken')
     .subscribe(res => {
       console.log('JWT Token Valid: ', res);
       this.sendUsername(res.user.username);
     },
     err => {
       console.log('JWT Token invalid: ', err);
       this.destroyUserCredentials();
     });
   }

   sendUsername(name: string) {
     this.username.next(name);
   }

   clearUsername() {
     this.username.next(undefined);
   }
   sendAdmin(admin: boolean) {
    this.admin.next(admin);
  }
  clearAdmin() {
    this.admin.next(undefined);
  }

   loadUserCredentials() {
     console.log(this.tokenKey);
     const credentials = JSON.parse(localStorage.getItem(this.tokenKey));
     console.log('loadUserCredentials ', credentials);
     if (credentials && credentials.username !== undefined) {
       this.useCredentials(credentials);
       if (this.authToken) {
         console.log(this.authToken)
        this.checkJWTtoken();
       }
     }
   }

   storeUserCredentials(credentials: any) {
     console.log('storeUserCredentials ', credentials);
      localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
     console.log(this.tokenKey,JSON.stringify(credentials));
     this.useCredentials(credentials);
   }

   useCredentials(credentials: any) {
     this.isAuthenticated = true;
     this.sendUsername(credentials.username);
     this.sendAdmin(credentials.admin);
     this.authToken = credentials.token;
   }

   destroyUserCredentials() {
     this.authToken = undefined;
     this.clearUsername();
     this.clearAdmin();
     this.isAuthenticated = false;
     localStorage.removeItem(this.tokenKey);
   }

   signUp(signup: any): Observable<any> {
    return this.http.post<SignUpResponse>(baseURL + 'users/signup',
    {'username': signup.username,'password':signup.password,'fullname':signup.fullname})
    .pipe(map(res => {
      return {'success': true,'username':signup.username}
    }),
    catchError(error => this.processHTTPMsgService.handleError(error)));
   }

   logIn(user: any): Observable<any> {
     return this.http.post<AuthResponse>(baseURL + 'users/login',
       {'username': user.username, 'password': user.password})
       .pipe( map(res => {
           this.storeUserCredentials({username: user.username, token: res.token, admin:res.admin});
           return {'success': true, 'username': user.username };
       }),
        catchError(error => this.processHTTPMsgService.handleError(error)));
   }

   logOut() {
     this.destroyUserCredentials();
   }

   isLoggedIn(): Boolean {
     return this.isAuthenticated;
   }

   getUsername(): Observable<string> {
     return this.username.asObservable();
   }

   getToken(): string {
      return this.authToken;
   }
   getAdmin():Observable<boolean> {
     return this.admin.asObservable();
   }
}