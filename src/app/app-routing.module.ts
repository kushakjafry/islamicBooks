import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookComponent } from './book/book.component';
import { ContactComponent } from './contact/contact.component';
import { BookshelfComponent} from './bookshelf/bookshelf.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { ResetComponent } from './reset/reset.component';
import { AdminGuard } from './guards/admin.guard';


const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'books',component:BookshelfComponent},
  {path:'contact',component:ContactComponent},
  {path:'books/:bookName',component:BookComponent},
  {path:'aboutus',component:AboutusComponent},
  {path:'confirm',component:ConfirmationComponent},
  {path:'categories',component:CategoriesComponent},
  {path:'category/:category',component:CategoryComponent},
  {path:'category/:category/:bookName',component:BookComponent},
  {path:'reset',component:ResetComponent},
  { path: 'admin',
  canActivate:[AdminGuard],
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
  {path:'',redirectTo:'/home',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
