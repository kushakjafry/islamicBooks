import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from './process-http-message.service';
import { category } from '../shared/category';
import { Book } from '../shared/book';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMessageService) {}

  getCategories():Observable<category[]>{
    return this.http.get<category[]>(baseURL+'category')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getCategory(category:string):Observable<category>{
    return this.http.get<category>(baseURL+'category/'+category)
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getCategoryBooks(category:string):Observable<Book[]>{
    return this.http.get<Book[]>(baseURL + 'category/'+category+'/books')
    .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
