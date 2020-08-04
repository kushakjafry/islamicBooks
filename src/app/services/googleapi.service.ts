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
  getSearchData():Observable<any>{
    return this.http.get<any>(baseURL+'googleapi/events/search')
    .pipe(catchError(this.processHttpErrMsgService.handleError))
  }
  getBooksData():Observable<any>{
    return this.http.get(baseURL+'googleapi/events/bookOpened')
    .pipe(catchError(this.processHttpErrMsgService.handleError));
  }
  getPagesData():Observable<any>{
    return this.http.get<any>(baseURL+'googleapi/pages')
    .pipe(catchError(this.processHttpErrMsgService.handleError));
  }
}
