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
  
    getBook(id: string): Observable<Book> {
      console.log(id);
      return this.http.get<Book>(baseURL + 'books/' + id)
        .pipe(catchError(this.processHTTPMsgService.handleError));
    }
  
  
    getBookIds(): Observable<number[] | any> {
      return this.getBooks().pipe(map(books => books.map(book => book._id)))
        .pipe(catchError(error => error));
    }
  
    postComment(bookId: string, comment: any) {
      return this.http.post(baseURL + 'books/' + bookId + '/comments', comment)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  
    }
    getComment(bookId:string){
      return this.http.get(baseURL+'books/'+bookId+'/comments')
      .pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
