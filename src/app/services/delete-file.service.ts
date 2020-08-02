import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from './process-http-message.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteFileService {

  constructor(private http:HttpClient,private processHttpMsgService:ProcessHttpMessageService) { }

  deleteBookImage(id:String){
    return this.http.delete(baseURL+'fileUpload/deleteBookImage?id='+id)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
  deleteBook(id:String){
    return this.http.delete(baseURL+'fileUpload/deleteBook?id='+id)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
  deleteCategory(id:String){
    return this.http.delete(baseURL+'fileUpload/deleteCategory?id='+id)
    .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
