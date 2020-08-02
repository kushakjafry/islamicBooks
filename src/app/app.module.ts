import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {ReactiveFormsModule} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxContentLoadingModule } from 'ngx-content-loading';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import{BookService} from './services/book.service';
import {FeedbackService} from './services/feedback.service';
import {CategoryService} from './services/category.service';
import {ForgotService} from './services/forgot.service';
import {ResetService} from './services/reset.service';


import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { BookshelfComponent } from './bookshelf/bookshelf.component';


import { FormsModule } from '@angular/forms';
import { NgxNavbarModule } from 'ngx-bootstrap-navbar';
import {LayoutModule} from '@angular/cdk/layout';
import { BookComponent } from './book/book.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { LoadingComponent } from './loading/loading.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from  '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from './services/auth.service';
import { AuthInterceptor, UnauthorizedInterceptor } from './services/auth.interceptor';
import { baseURL } from './shared/baseurl';
import { ProcessHttpMessageService } from './services/process-http-message.service';
import { LoginComponent } from './login/login.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BaseUrlFile } from './shared/baseUrlFile';
import { BaseUrlGoogle } from './shared/baseUrlGoogle';
import { ConfirmationService} from './services/confirmation.service';
import {MatMenuModule} from '@angular/material/menu';
import {GoogleAnalyticsService} from './services/google-analytics.service';
import {GoogleapiService} from './services/googleapi.service';
import {UserService} from './services/user.service';
import {FileUploadService} from './services/file-upload.service';
import {DeleteFileService} from './services/delete-file.service';

import { HttpClientModule } from '@angular/common/http';

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { AboutusComponent } from './aboutus/aboutus.component';
import { SignupComponent } from './signup/signup.component';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './category/category.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { NavbarService } from './services/navbar.service';
import { FooterService } from './services/footer.service';
import { AdminGuard } from './guards/admin.guard';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ContactComponent,
    BookshelfComponent,
    BookComponent,
    LoadingComponent,
    AboutusComponent,
    LoginComponent,
    SignupComponent,
    ConfirmationComponent,
    CategoriesComponent,
    CategoryComponent,
    ForgotComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    NgxNavbarModule,
    LayoutModule,
    MatCardModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatFormFieldModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AlertModule.forRoot(),
    NgxContentLoadingModule,
    BsDropdownModule.forRoot(),
    MatMenuModule,
    FontAwesomeModule,
  ],
  providers: [
    BookService,
    {provide: 'baseURL', useValue: baseURL},
    {provide: 'baseURLFile',useValue: BaseUrlFile},
    {provide: 'baseURLGoogle',useValue:BaseUrlGoogle},
    ProcessHttpMessageService,
    AuthService,
    FeedbackService,
    ConfirmationService,
    CategoryService,
    ForgotService,
    ResetService,
    NavbarService,
    FooterService,
    AdminGuard,
    GoogleAnalyticsService,
    GoogleapiService,
    UserService,
    FileUploadService,
    DeleteFileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
  ],
  entryComponents:[
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
