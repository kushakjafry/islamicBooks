import { Component, inject, Inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
    @Inject('baseURLFile') private baseURLFile,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('Categories');
    this.metaTagService.addTag(
      {name:'description',content:'Categorise books in different categories'}
    )
    this.categoryService.getCategories()
    .subscribe((categories) => this.Categories = categories,
    (errmess) => this.errMess = errmess);
  }

}
