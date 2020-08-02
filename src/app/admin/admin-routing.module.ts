import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddBookComponent } from './add-book/add-book.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AdminBookComponent } from './admin-book/admin-book.component';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';


const routes: Routes = [
  {path:'dashboard',component:DashboardComponent},
  {path:'books',component:AdminBooksComponent},
  {path:'users',component:AdminUsersComponent},
  {path:'categories',component:AdminCategoryComponent},
  {path:'categories/add',component:AddCategoryComponent},
  {path:'categories/:categoryName',component:EditCategoryComponent},
  {path:'books/add',component:AddBookComponent},
  {path:'books/:bookName',component:AdminBookComponent},
  {path: '', redirectTo:'dashboard',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
