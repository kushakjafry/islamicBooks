import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMessageService } from './process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {

  constructor(private http:HttpClient,
    private processHTTPMsgService:ProcessHttpMessageService) { }
  forgotEmail(data){
    return this.http.post(baseURL+'users/forgot',data)
    .pipe(catchError(this.processHTTPMsgService.handleError))
  }
}
