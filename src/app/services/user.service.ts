import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from './process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMessageService) { }

    getUsers(){
      return this.http.get(baseURL+'users')
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
    getUser(name:string){
      return this.http.get(baseURL+'users/'+name)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
