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

  fileUploadBookImage(formData:FormData){
    return this.http.post<any>(baseURL+'fileUpload/bookImage', formData)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
  fileUploadBook(formData:FormData){
    return this.http.post<any>(baseURL+'fileUpload/book', formData)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
  fileUploadCategory(formData:FormData){
    return this.http.post<any>(baseURL+'fileUpload/category',formData)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
