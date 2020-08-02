import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { DeleteFileService } from 'src/app/services/delete-file.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { FooterService } from 'src/app/services/footer.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { category } from 'src/app/shared/category';



@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  constructor(public nav:NavbarService,
    private fb:FormBuilder,
    public footer:FooterService,private auth:AuthService,private router:Router,
    private categoryService:CategoryService,
    private route:ActivatedRoute,
    @Inject('baseURL') private baseURL,
    @Inject('baseURLFile') private baseURLFile,
    @Inject('baseURLGoogle') private baseURLGoogle,
    private fileUploadService:FileUploadService,
    private deleteFileService:DeleteFileService) { }

    @ViewChild('categoryForm') categoryFormDirective;
    images;
    hideform:boolean = false;
    imagePreview:String;
    Category:category;
    errMess:string;
    visibility = 'shown';
    comments:[];
    CategoryForm:FormGroup;
    formErrors = {
      'category': '',
      'description':''
    };
  
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
          this.categoryService.updateCategory(UploadForm,this.Category.category)
          .subscribe((category:any) => {
            this.deleteFileService.deleteCategory(this.Category.image)
            .subscribe((categories:any) => {
              var category1 = categories;
              this.Category = category;
              this.hideform = false;
            },(err) => {this.errMess = err,this.hideform = false})
          },(err) => {this.errMess = err,this.hideform = false})
        },(err) => {this.errMess = err,this.hideform = false})
      }else{
        var UploadForm = {
          'category': this.CategoryForm.value.category,
          'description':this.CategoryForm.value.description,
        }
        this.categoryService.updateCategory(UploadForm,this.Category.category)
        .subscribe((category:any) => {
          this.hideform = false;
          this.Category = category;
        },(err) =>  {this.errMess = err,this.hideform = false})
      }
    }
  ngOnInit(): void {
    this.nav.hide();
    this.footer.hide();
      this.route.params.pipe(switchMap((params: Params) => { console.log(params['categoryName']);return this.categoryService.getCategory(params['categoryName']); }))
      .subscribe(category => {
      this.Category = category;
      this.createForm();
      this.imagePreview = category.image;
      this.visibility = 'shown';
      },errmess => this.errMess = <any>errmess);
    }

  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    // this.subscription.unsubscribe();
  }
  createForm(){
    this.CategoryForm = this.fb.group({
      'category':[this.Category.category,Validators.required],
      'description':[this.Category.description,Validators.required]
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


}
