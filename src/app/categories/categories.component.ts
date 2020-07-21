import { Component, Inject, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { category } from '../shared/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  Categories:category[];
  errMess: String[];

  constructor(private categoryService:CategoryService,
    @Inject('baseURLFile') private baseURLFile) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
    .subscribe((categories) => this.Categories = categories,
    (errmess) => this.errMess = errmess);
  }

}
