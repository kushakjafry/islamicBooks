import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { BookService } from '../services/book.service';
import { category } from '../shared/category';
import { Book } from '../shared/book';
import { Params,ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '../services/google-analytics.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {faSearch} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  faSearch=faSearch;
  Category:category;
  @ViewChild('sform') searchFormDirective;
  books: Book[];
  errMess:string;
  booksSearch: Book[];
  searchForm: FormGroup;

  constructor(private categoryService:CategoryService,
    private bookService:BookService,
    @Inject('baseURLFile') private baseURLFile,
    private route:ActivatedRoute,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private titleService: Title,
    private metaTagService: Meta,
    private googleAnalyticsService:GoogleAnalyticsService,
    private fb:FormBuilder) {
      this.searchForm = this.fb.group({
        search: ''
      });
      
      this.searchForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
     }

  ngOnInit(): void {
    this.route.params.pipe(switchMap((params: Params) => { return this.categoryService.getCategory(params['category']); }))
    .subscribe((category) => {
      this.Category = category;
      this.titleService.setTitle(<string>this.Category.category);
      this.metaTagService.addTag(
      {name:'description',content:'Books under '+this.Category.category+' category'}
    )
    })
    this.route.params.pipe(switchMap((params:Params) => {return this.categoryService.getCategoryBooks(params['category']);}))
    .subscribe((books) => {
      this.books = books;
      this.booksSearch = this.books;
    },(err) => this.errMess = err)
  }
  sendBookName(name:string){
    this.googleAnalyticsService.eventEmitter('engagement',name,'books_opened',2)
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
}
