import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { Book } from '../shared/book';
import { Comment } from '../shared/Comment';
import { BookService } from '../services/book.service';
import { Params,ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';




@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;
  book:Book;
  bookCopy:Book;
  bookIds:string[];
  prev: string;
  next:string;
  errMess:string;
  visibility = 'shown';  
  comments:[];
  comment:Comment = {
    'user':'',
    'comment' : '',
    'rating':5,
    'date':''
  };

  formErrors = {
    'comment': ''
  };

  validationMessages = {
    'comment': {
      'required':      'Comment is required.'
    }
  };

  commentForm : FormGroup;
  errMessComment: string;
  defaultAlerts: any = {
    type: '',
    msg : ''
  }
  alerts = this.defaultAlerts;

  constructor(private fb:FormBuilder,
    private bookService:BookService,
    private route:ActivatedRoute,
    private location: Location,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile) {
      
   }

  ngOnInit(): void {
      this.createForm();

      this.bookService.getBookIds().subscribe(bookIds => {this.bookIds = bookIds; console.log(this.bookIds)});
      console.log(this.bookIds);
      this.route.params.pipe(switchMap((params: Params) => { console.log(params['bookId']);return this.bookService.getBook(params['bookId']); }))
      .subscribe(book => {
      this.book = book;
      this.setPrevNext(book._id);
      this.visibility = 'shown';
    },errmess => this.errMess = <any>errmess);
      this.route.params.pipe(switchMap((params:Params) => { return this.bookService.getComment(params['bookId']);}))
      .subscribe(comments => {
      this.comments = <[]>comments;
    },errmess => this.errMess = <any>errmess);
  }
  setPrevNext(bookId: string) {
    const index = this.bookIds.indexOf(bookId);
    this.prev = this.bookIds[(this.bookIds.length + index - 1) % this.bookIds.length];
    this.next = this.bookIds[(this.bookIds.length + index + 1) % this.bookIds.length];
  }
  goBack(): void {
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      'comment' : ['',Validators.required],
      'rating' : 5
    });
    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  
  }

  onValueChanged(data?: any) {
    console.log(this.commentForm.value)
    if (!this.commentForm) { return; }
    const form = this.commentForm;
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

  onSubmit() {
    this.bookService.postComment(this.book._id, this.commentForm.value)
    .subscribe(book => {this.book = <Book>book;
      this.errMessComment = 'LoggedIn';
      this.alerts.type = "success";
      this.alerts.msg = "Comment SuccessFul";
      this.route.params.pipe(switchMap((params:Params) => { return this.bookService.getComment(params['bookId']);}))
      .subscribe(comments => {
      this.comments = <[]>comments;
    },errmess => this.errMess = <any>errmess)
  },errmess => {this.errMessComment = errmess;
    if(errmess.indexOf(404)){
      this.alerts.type = 'danger',
      this.alerts.msg = 'Please Login to comment'
    }
  });
  this.commentFormDirective.resetForm();
  this.commentForm.reset({
    rating: 5,
    comment: ''
  });
  }

}
