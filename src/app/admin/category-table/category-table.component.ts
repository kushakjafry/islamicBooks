import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { CategoryService } from 'src/app/services/category.service';
import { DeleteFileService } from 'src/app/services/delete-file.service';
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons';


export interface Category {
  category: String;
  description: String;
  id: number;
  image:String;
}

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss']
})
export class CategoryTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  defaultAlerts: any = {
    type: '',
    msg : ''
  }
  errMess:string;
  successMess:string;
  alerts = this.defaultAlerts;
 
  reset(): void {
    this.alerts = this.defaultAlerts;
  }
  
  displayedColumns: string[] = ['No.', 'Category', 'Description','Edit'];
  dataSourceCopy:Category[] = [];
  dataSource = new MatTableDataSource(this.dataSourceCopy);
  showSpinner:boolean = true;
  faEdit=faEdit;
  faTrash=faTrash;

  constructor(private categoryService:CategoryService,
    private deleteFileService:DeleteFileService) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
    .subscribe((categories) => {
      let count = 1;
      categories.forEach((category) => {
        var dataRow:Category = {
          category:'',
          id:0,
          description:'',
          image:''
        };
        dataRow.category = category.category;
        dataRow.id = count;
        dataRow.description = category.description;
        dataRow.image = category.image;
        count = count + 1;
        this.dataSourceCopy.push(dataRow);
      })
      this.dataSource = new MatTableDataSource(this.dataSourceCopy);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    })
  }
  deleteCategory(category:any){
    if(confirm("Are you sure to delete "+category.category)){
    this.deleteFileService.deleteCategory(category.image)
    .subscribe((file:any) => {
      var file = file;
      this.categoryService.deleteCategory(category.category)
      .subscribe((data:any) => {
        var file = file;
        this.showSpinner = false;
        this.alerts.msg = 'Successfully deleted';
        this.alerts.type="success";
        this.successMess = 'deleted';
        const newData = this.dataSource.data;
        const newArrayData = newData.filter(x => x.category !== category.category)
        this.dataSource.data = newArrayData;
      },(err) => {this.errMess = err; this.alerts.msg = 'error occured';this.alerts.type="danger";this.showSpinner = false;})
    },(err) => {this.errMess = err; this.alerts.msg = 'error occured';this.alerts.type="danger";this.showSpinner = false;})
  }else{
    this.alerts.msg = "No Image submitted";
    this.alerts.type = "danger";
    this.errMess = "No Image"
  }
}
alertDismiss(){
  this.errMess = null;
  this.successMess = null;
}

}
