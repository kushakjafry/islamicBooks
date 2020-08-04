import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { switchMap } from 'rxjs/operators';
import { FooterService } from '../services/footer.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  faEdit=faEdit;
  User:any;
  constructor(private router:ActivatedRoute,private footer:FooterService,
    private userService:UserService) { }

  ngOnInit(): void {
    this.footer.hide();
    this.router.params.pipe(switchMap((params:Params) => {return this.userService.getUser(params['username'])}))
    .subscribe((data) => {
      this.User = data;
    })
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.footer.show();
  }

}
