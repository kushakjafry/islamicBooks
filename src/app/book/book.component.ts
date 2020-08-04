import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { Book } from '../shared/book';
import { Comment } from '../shared/Comment';
import { BookService } from '../services/book.service';
import { Params,ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { faChevronLeft,faChevronRight,faDownload,faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  title = 'book';


  fromCategories:boolean = false;
  faChevronLeft=faChevronLeft;
  faChevronRight=faChevronRight;
  faDownload=faDownload;
  faArrowLeft=faArrowLeft;
  @ViewChild('cform') commentFormDirective;
  book:Book;
  bookCopy:Book;
  bookNames:string[];
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
    @Inject('baseURLFile') private baseURLFile,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private titleService: Title,
    private metaTagService: Meta) {
      
   }

  ngOnInit(): void {
    this.route.queryParamMap
    .subscribe((params) => {
      if(params.get('categories')){
        this.fromCategories = true;
      }
    }
  );
  
      this.createForm();
      this.bookService.getBookNames().subscribe(bookNames => {this.bookNames = bookNames; console.log(this.bookNames)});
      console.log(this.bookNames);
      this.route.params.pipe(switchMap((params: Params) => { return this.bookService.getBook(params['bookName']); }))
      .subscribe(book => {
      this.book = book;
      this.title = book.name;
      this.titleService.setTitle(this.title);
    this.metaTagService.updateTag(
      { name: 'description', content: 'Download book'+book.name }
    );
      this.setPrevNext(book.name);
      this.visibility = 'shown';
    },errmess => this.errMess = <any>errmess);
      this.route.params.pipe(switchMap((params:Params) => { return this.bookService.getComment(params['bookName']);}))
      .subscribe(comments => {
      this.comments = <[]>comments;
    },errmess => this.errMess = <any>errmess);
  }
  setPrevNext(bookName: string) {
    const index = this.bookNames.indexOf(bookName);
    this.prev = this.bookNames[(this.bookNames.length + index - 1) % this.bookNames.length];
    this.next = this.bookNames[(this.bookNames.length + index + 1) % this.bookNames.length];
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
    this.bookService.postComment(this.book.name, this.commentForm.value)
    .subscribe(book => {this.book = <Book>book;
      this.errMessComment = 'LoggedIn';
      this.alerts.type = "success";
      this.alerts.msg = "Comment SuccessFul";
      this.route.params.pipe(switchMap((params:Params) => { return this.bookService.getComment(params['bookName']);}))
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
