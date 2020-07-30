import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { AdminRoutingModule } from './admin-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ChartsModule } from 'ng2-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminBookComponent } from './admin-book/admin-book.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BooksTableComponent } from './books-table/books-table.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { baseURL } from '../shared/baseurl';
import { BaseUrlFile } from '../shared/baseUrlFile';
import { NavigationInsideComponent } from './navigation-inside/navigation-inside.component';
import { MatFormFieldModule } from  '@angular/material/form-field';
import { MatInputModule } from  '@angular/material/input';



@NgModule({
  declarations: [DashboardComponent, 
    NavigationComponent, 
    AdminFooterComponent, 
    AdminUsersComponent, 
    AdminBooksComponent, 
    AdminCategoryComponent, 
    AdminBookComponent, BooksTableComponent, UsersTableComponent, NavigationInsideComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ChartsModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers:[
    {provide: 'baseURL', useValue: baseURL},
    {provide: 'baseURLFile',useValue: BaseUrlFile},
  ]
})
export class AdminModule { }
