import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { DeleteFileService } from 'src/app/services/delete-file.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FooterService } from 'src/app/services/footer.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { Book } from 'src/app/shared/book';
import { category } from 'src/app/shared/category';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(public nav:NavbarService,
    private fb:FormBuilder,
    public footer:FooterService,private auth:AuthService,private router:Router,
    private categoryService:CategoryService,
    private route:ActivatedRoute,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private fileUploadService:FileUploadService) { }

    @ViewChild('categoryform') categoryFormDirective;
    images;
    hideform:boolean = false;
    imagePreview:string;
    Categories: [];
    errMess:string;
    visibility = 'shown';
    CategoryForm:FormGroup;
    formErrors = {
      'category': '',
      'description':''
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
    Category:category;

    validationMessages = {
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
      this.hideform = true;
      if(this.images){
        const formData = new FormData();
        formData.append('file', this.images);
        this.fileUploadService.fileUploadCategory(formData)
        .subscribe((res:any) => {
          this.imagePreview = res.file.id;
          var UploadForm = {
            'category': this.CategoryForm.value.category,
            'description':this.CategoryForm.value.description,
            'image':res.file.id
          }
          this.categoryService.postCategory(UploadForm)
          .subscribe((category:any) => {
            this.Category = category;
            this.hideform = false;
            this.alerts.msg = 'Category Added Successfully';
            this.alerts.type = 'success';
            this.successMess = 'done';
        },(err) => {this.errMess = err,this.hideform = false})
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
    this.createForm();
  }

  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    // this.subscription.unsubscribe();
  }
  
  createForm(){
    this.CategoryForm = this.fb.group({
      'description':['',Validators.required],
      'category':['',Validators.required]
    })
    this.CategoryForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  
  }

  onValueChanged(data?: any) {
    console.log(this.CategoryForm.value)
    if (!this.CategoryForm) { return; }
    const form = this.CategoryForm;
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
    this.CategoryForm.reset({
      description:'',
      category:''
    });
    this.imagePreview = '';
    this.categoryFormDirective.resetForm();
  }
  alertDismiss(){
    this.errMess = null;
    this.successMess = null;
  }

}
