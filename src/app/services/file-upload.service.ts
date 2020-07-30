import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from './process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http:HttpClient,private processHttpMsgService:ProcessHttpMessageService) { }

  fileUpload(formData:FormData){
    return this.http.post<any>(baseURL+'fileUpload', formData)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
