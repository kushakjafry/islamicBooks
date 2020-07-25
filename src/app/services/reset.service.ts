import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';
import { ProcessHttpMessageService } from './process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class ResetService {

  constructor(private http:HttpClient,
    private processHttpmsgService:ProcessHttpMessageService) { }

  ResetPassword(data,query:String){
    return this.http.post(baseURL+'users/reset?q='+query,data)
      .pipe(catchError(this.processHttpmsgService.handleError));
  }
}
