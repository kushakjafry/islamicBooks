import { Injectable } from '@angular/core';
import { Book } from '../shared/book';
import { Comment } from '../shared/Comment'; 
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { ProcessHttpMessageService } from './process-http-message.service';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHttpMessageService) { }

    getBooks(): Observable<Book[]> {
      return this.http.get<Book[]>(baseURL + 'books')
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }
  
    getBook(name: string): Observable<Book> {
      console.log(name);
      return this.http.get<Book>(baseURL + 'books/' + name)
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }
  
  
    getBookNames(): Observable<number[] | any> {
      return this.getBooks().pipe(map(books => books.map(book => book.name)))
        .pipe(catchError(error => error));
    }
  
    postComment(bookName: string, comment: any) {
      return this.http.post(baseURL + 'books/' + bookName + '/comments', comment)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  
    }
    getComment(bookName:string){
      return this.http.get(baseURL+'books/'+bookName+'/comments')
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
    updateBook(form:any,bookName:string){
      return this.http.put(baseURL+'books/'+bookName,form)
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
