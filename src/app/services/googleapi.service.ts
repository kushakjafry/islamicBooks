import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMessageService } from './process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleapiService {

  constructor(private http:HttpClient,private processHttpErrMsgService:ProcessHttpMessageService) { }
  
  getNewUserData():Observable<any>{
    return this.http.get<any>(baseURL+'googleapi/user')
    .pipe(catchError(this.processHttpErrMsgService.handleError))
  }
}
