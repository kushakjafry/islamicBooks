import { Component,  OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { UserService } from 'src/app/services/user.service';

export interface PeriodicElement {
  name: string;
  admin: string;
  email: string;
  id: number;
  confirmed:string;
}

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['No.', 'Name', 'Email', 'Confirmed','Admin'];
  dataSourceCopy:PeriodicElement[] = [];
  dataSource = new MatTableDataSource(this.dataSourceCopy);
  showSpinner:boolean = true;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getUsers()
    .subscribe((Users:any) => {
      let count = 1;
      Users.forEach((user:any) => {
        var dataRow:PeriodicElement = {
          name:'',
          admin: 'No',
          id:0,
          confirmed:'Yes',
          email:''
        };
        console.log(user);
        dataRow.name = user.fullname;
        dataRow.id = count;
        dataRow.email = user.username;
        if(user.admin){
          dataRow.admin = 'Yes'
        }
        if(!user.confirmed){
          dataRow.confirmed = 'No'
        }
        count = count + 1;
        this.dataSourceCopy.push(dataRow);
        console.log(this.dataSourceCopy);
      })
      this.dataSource = new MatTableDataSource(this.dataSourceCopy);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.showSpinner = false;
    })
  }
}
