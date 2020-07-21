import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { Book } from '../shared/book';
import { BookService } from '../services/book.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as e from 'express';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss']
})
export class BookshelfComponent implements OnInit {

  @ViewChild('sform') searchFormDirective;
  books: Book[];
  hover:boolean = false;
  errMess: string;
  booksSearch: Book[];
  searchForm: FormGroup;



  constructor(private bookService:BookService,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile,
    private fb:FormBuilder) {
      this.searchForm = this.fb.group({
        search: ''
      });
      
      this.searchForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
   }

  ngOnInit(): void {
    this.bookService.getBooks()
      .subscribe(books => {this.books = books;this.booksSearch = books},
        errmess => this.errMess = <any>errmess);
  }

  onValueChanged(data?:any){
    console.log(data);
    if(this.searchForm.value.search){
      this.booksSearch = this.books.filter(el => el.name.toLowerCase().startsWith(data.search.toLowerCase()));
      console.log(this.booksSearch);
    }else{
      this.booksSearch = this.books;
    }
  }
}
