import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';


export interface PeriodicElement {
  name: string;
  category: string;
  author: string;
  id: number;
}


@Component({
  selector: 'app-books-table',
  templateUrl: './books-table.component.html',
  styleUrls: ['./books-table.component.scss']
})
export class BooksTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['No.', 'Name', 'Author', 'Category','Edit'];
  dataSourceCopy:PeriodicElement[] = [];
  dataSource = new MatTableDataSource(this.dataSourceCopy);
  showSpinner:boolean = true;

  constructor(private bookService:BookService) { }

  ngOnInit(): void {
    this.bookService.getBooks()
    .subscribe((books) => {
      let count = 1;
      books.forEach((book) => {
        var dataRow:PeriodicElement = {
          name:'',
          author:'',
          id:0,
          category:''
        };
        dataRow.name = book.name;
        dataRow.id = count;
        dataRow.category = book.category;
        dataRow.author = book.author;
        count = count + 1;
        this.dataSourceCopy.push(dataRow);
      })
      this.dataSource = new MatTableDataSource(this.dataSourceCopy);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    })
  }

}
