import { Component, Inject, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { BookService } from '../services/book.service';
import { category } from '../shared/category';
import { Book } from '../shared/book';
import { Params,ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  Category:category;
  books: Book[];

  constructor(private categoryService:CategoryService,
    private bookService:BookService,
    @Inject('baseURLFile') private baseURLFile,
    private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(switchMap((params: Params) => { console.log(params['category']);return this.categoryService.getCategory(params['category']); }))
    .subscribe((category) => {
      this.Category = category;
      console.log(category);
    })
  }

}