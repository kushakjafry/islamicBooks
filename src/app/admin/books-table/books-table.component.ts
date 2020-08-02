import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { DeleteFileService } from 'src/app/services/delete-file.service';


export interface Book {
  name: string;
  category: string;
  author: string;
  id: number;
  _id:string;
  image:string;
  download:string;
}


@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.scss']
})
export class BooksTableComponent implements OnInit {

  faEdit=faEdit;
  faTrash=faTrash;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['No.', 'Name', 'Author', 'Category','Edit'];
  dataSourceCopy:Book[] = [];
  dataSource = new MatTableDataSource(this.dataSourceCopy);
  showSpinner:boolean = true;
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

  constructor(private bookService:BookService,
    private deleteFileService:DeleteFileService) { }

  ngOnInit(): void {
    this.bookService.getBooks()
    .subscribe((books) => {
      let count = 1;
      books.forEach((book) => {
        var dataRow:Book = {
          name:'',
          author:'',
          id:0,
          category:'',
          download:'',
          _id:'',
          image:'',
        };
        dataRow.name = book.name;
        dataRow.id = count;
        dataRow.category = book.category;
        dataRow.author = book.author;
        dataRow.image = book.image;
        dataRow.download = book.download;
        console.log(dataRow);
        count = count + 1;
        this.dataSourceCopy.push(dataRow);
      })
      this.dataSource = new MatTableDataSource(this.dataSourceCopy);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    })
  }
  deleteBook(book:any){
    if(confirm("Are you sure to delete "+book.name)){
      this.showSpinner = true;
      this.deleteFileService.deleteBook(book.download)
      .subscribe((file:any) => {
        var file = file;
        this.deleteFileService.deleteBookImage(book.image)
        .subscribe((file:any) => {
          var file = file;
          this.bookService.deleteBook(book.name)
          .subscribe((file:any) => {
            var file = file;
            this.showSpinner = false;
            this.alerts.msg = 'Successfully deleted';
            this.alerts.type="success";
            this.successMess = 'deleted';
            const newData = this.dataSource.data;
            const newArrayData = newData.filter(x => x.name !== book.name)
            this.dataSource.data = newArrayData;
          },(err) => {this.errMess = err; this.alerts.msg = 'error occured';this.alerts.type="danger";this.showSpinner = false;})
        },(err) => {this.errMess = err; this.alerts.msg = 'error occured';this.alerts.type="danger";this.showSpinner = false;})
      },(err) => {this.errMess = err; this.alerts.msg = 'error occured';this.alerts.type="danger";this.showSpinner = false;})
    }
  }
  alertDismiss(){
    this.errMess = null;
    this.successMess = null;
  }

}
