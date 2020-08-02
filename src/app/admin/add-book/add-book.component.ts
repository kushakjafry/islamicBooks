import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { DeleteFileService } from 'src/app/services/delete-file.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FooterService } from 'src/app/services/footer.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { Book } from 'src/app/shared/book';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  constructor(public nav:NavbarService,
    private fb:FormBuilder,
    public footer:FooterService,private auth:AuthService,private router:Router,
    private categoryService:CategoryService,
    private bookService:BookService,
    private route:ActivatedRoute,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private fileUploadService:FileUploadService,
    private deleteFileService:DeleteFileService) { }

    @ViewChild('bookform') bookFormDirective;
    images;
    bookPdf;
    hideform:boolean = false;
    imagePreview:string;
    Categories: String[];
    book:Book;
    errMess:string;
    visibility = 'shown';
    comments:[];
    BookForm:FormGroup;
    formErrors = {
      'name': '',
      'author':'',
      'description':'',
      'category':''
    };
    defaultAlerts: any = {
      type: '',
      msg : ''
    }
    successMess:string;
    alerts = this.defaultAlerts;
   
    reset(): void {
      this.alerts = this.defaultAlerts;
    }

    validationMessages = {
      'name': {
        'required':'Book Name is required'
      },
      'author':{
        'required':'Author is required'
      },
      'description': {
        'required':'Description is required'
      },
      'category': {
        'required':'Category is required'
      }
    };

    selectImage(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.images = file;
      }
    }
    selectBook(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.bookPdf = file;
      }
    }
    onSubmit(){
      this.hideform = true;
      if(this.images){
        const formData = new FormData();
        formData.append('file', this.images);
        this.fileUploadService.fileUploadBookImage(formData)
        .subscribe((res:any) => {
          this.imagePreview = res.file.id;
          if(this.bookPdf){
            const bookData = new FormData();
          bookData.append('file',this.bookPdf);
          this.fileUploadService.fileUploadBook(bookData)
            .subscribe((resBook:any) => {
              var UploadForm = {
                'name':this.BookForm.value.name,
                'category': this.BookForm.value.category,
                'description':this.BookForm.value.description,
                'author':this.BookForm.value.author,
                'image':res.file.id,
                'download':resBook.file.id
              }
              this.bookService.postBook(UploadForm)
              .subscribe((book:any) => {
                this.book = book;
                this.hideform = false;
                this.alerts.msg = 'Book Added Successfully';
                this.alerts.type = 'success';
                this.successMess = 'done';
            },(err) => {this.errMess = err,this.hideform = false})
          },(err) => {this.errMess = err,this.hideform = false})
          }else{
            this.alerts.msg = "No Book Uploaded"
            this.alerts.type = "danger";
            this.errMess = "No Book";
          }
        },(err) => {this.errMess = err,this.hideform = false})
      }else{
        this.alerts.msg = "No Image Uploaded"
        this.alerts.type = "danger";
        this.errMess = "No image";
      }
    }

  ngOnInit(): void {
    this.nav.hide();
    this.footer.hide();
    this.categoryService.getCategories()
    .subscribe((categories) => {
      this.Categories = categories.map((category) => category.category);
      console.log(this.Categories);
    })
    this.createForm();
  }

  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    // this.subscription.unsubscribe();
  }
  
  createForm(){
    this.BookForm = this.fb.group({
      'name':['',Validators.required],
      'author':['',Validators.required],
      'description':['',Validators.required],
      'category':['',Validators.required]
    })
    this.BookForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  
  }

  onValueChanged(data?: any) {
    console.log(this.BookForm.value)
    if (!this.BookForm) { return; }
    const form = this.BookForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  resetButton(){
    this.errMess = null;
    this.successMess = null;
    this.BookForm.reset({
      name: '',
      author:'',
      description:'',
      category:''
    });
    this.imagePreview = '';
    this.bookFormDirective.resetForm();
  }
  alertDismiss(){
    this.errMess = null;
    this.successMess = null;
  }
}
