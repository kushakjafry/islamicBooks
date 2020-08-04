import { Component, OnInit,Inject, ViewChild, Injector } from '@angular/core';
import { Book } from '../shared/book';
import { BookService } from '../services/book.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import{GoogleAnalyticsService} from '../services/google-analytics.service';
import { Meta, Title } from '@angular/platform-browser';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.component.html',
  styleUrls: ['./bookshelf.component.scss']
})
export class BookshelfComponent implements OnInit {

  faSearch=faSearch
  @ViewChild('sform') searchFormDirective;
  books: Book[];
  hover:boolean = false;
  errMess: string;
  booksSearch: Book[];
  searchForm: FormGroup;



  constructor(private bookService:BookService,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private fb:FormBuilder,private googleAnalyticsService:GoogleAnalyticsService,
    private titleService: Title,
    private metaTagService: Meta) {
      this.searchForm = this.fb.group({
        search: ''
      });
      
      this.searchForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
   }

  ngOnInit(): void {
    this.titleService.setTitle('Bookshelf');
    this.metaTagService.addTag(
      {name:'description',content:'Bookshelf for free pdf of urdu/islamic books'}
    )
    this.bookService.getBooks()
      .subscribe(books => {this.books = books;this.booksSearch = books},
        errmess => this.errMess = <any>errmess);
  }

  onValueChanged(data?:any){
    console.log(data);
    if(!this.searchForm.value.search){
      this.booksSearch = this.books;
    }
  }
  onSearch(){
    if(this.searchForm.value.search){
      this.booksSearch = this.books.filter(el => el.name.toLowerCase().startsWith(this.searchForm.value.search.toLowerCase()));
      console.log(this.booksSearch);
      this.googleAnalyticsService.eventEmitter('engagement',this.searchForm.value.search,'search_term',1)
    }else{
      this.booksSearch = this.books;
    }
  }
  sendBookName(name:string){
    this.googleAnalyticsService.eventEmitter('engagement',name,'books_opened',2)
  }
}
