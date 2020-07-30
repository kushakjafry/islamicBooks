import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { CategoryService } from 'src/app/services/category.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FooterService } from 'src/app/services/footer.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { BaseUrlFile } from 'src/app/shared/baseUrlFile';
import { Book } from 'src/app/shared/book';

@Component({
  selector: 'app-admin-book',
  templateUrl: './admin-book.component.html',
  styleUrls: ['./admin-book.component.scss']
})
export class AdminBookComponent implements OnInit {

  constructor(public nav:NavbarService,
    private fb:FormBuilder,
    public footer:FooterService,private auth:AuthService,private router:Router,
    private categoryService:CategoryService,
    private bookService:BookService,
    private route:ActivatedRoute,
    private location: Location,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile,
    private fileUploadService:FileUploadService) { }

    @ViewChild('bookform') bookFormDirective;
    images;
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
    onSubmit(){
      if(this.images){
        const formData = new FormData();
        formData.append('file', this.images);
        this.fileUploadService.fileUpload(formData)
        .subscribe((res:any) => {
          this.imagePreview = 'images/' + res.file.originalname;
          var UploadForm = {
            'name':this.BookForm.value.name,
            'category': this.BookForm.value.category,
            'description':this.BookForm.value.description,
            'author':this.BookForm.value.author,
            'image':'images/'+res.file.originalname
          }
          this.bookService.updateBook(UploadForm,this.book.name)
          .subscribe((book:any) => {
            this.book = book;
          },(err) => this.errMess = err)
        },(err) => this.errMess = err)
      }else{
        var UploadForm = {
          'name':this.BookForm.value.name,
          'category': this.BookForm.value.category,
          'description':this.BookForm.value.description,
          'author':this.BookForm.value.author
        }
        this.bookService.updateBook(UploadForm,this.book.name)
        .subscribe((book:any) => {
          this.book = book;
        },(err) => this.errMess = err)
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
      this.route.params.pipe(switchMap((params: Params) => { console.log(params['bookName']);return this.bookService.getBook(params['bookName']); }))
      .subscribe(book => {
      this.book = book;
      this.createForm();
      this.imagePreview = book.image;
      this.visibility = 'shown';
      },errmess => this.errMess = <any>errmess);
        this.route.params.pipe(switchMap((params:Params) => { return this.bookService.getComment(params['bookName']);}))
        .subscribe(comments => {
        this.comments = <[]>comments;
      },errmess => this.errMess = <any>errmess);
    }

  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    // this.subscription.unsubscribe();
  }
  createForm(){
    this.BookForm = this.fb.group({
      'name':[this.book.name,Validators.required],
      'author':[this.book.author,Validators.required],
      'description':[this.book.description,Validators.required],
      'category':[this.book.category,Validators.required]
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

}
