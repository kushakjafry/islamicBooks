import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from './process-http-message.service';



@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(private http:HttpClient,
    private processHTTPMsgService: ProcessHttpMessageService ) { }

  confirmAccount(query:String){
    return this.http.get(baseURL + 'confirm?q='+query)
        .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
