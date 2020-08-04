import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { FooterService } from '../services/footer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  @ViewChild('pform') profileFormDirective;
  User:any;
  profileForm:FormGroup;
  formErrors = {
    'fullname': '',
  };

  validationMessages = {
    'fullname': {
      'required': 'name is required.'
    }
  };

  constructor(private footer:FooterService,private fb:FormBuilder,
    private router:ActivatedRoute,private userService:UserService) { }

  ngOnInit(): void {
    this.footer.hide();
    this.router.params.pipe(switchMap((params:Params) => {return this.userService.getUser(params['username'])}))
    .subscribe((data) => {
      this.User = data;
    })
  }
  ngOnDestroy(): void {
    this.footer.show();
  }
  createForm(){
    this.profileForm = this.fb.group({
      'fullname':[this.User.username,Validators.required],
      'profession':[this.User.profession],
      'bio':[this.User.bio],
      'gender':[this.User.gender]
    })
    this.profileForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged();
  }

  onValueChanged(data?: any) {
    console.log(this.profileForm.value)
    if (!this.profileForm) { return; }
    const form = this.profileForm;
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
