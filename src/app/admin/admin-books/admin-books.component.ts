import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FooterService } from 'src/app/services/footer.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrls: ['./admin-books.component.scss']
})
export class AdminBooksComponent implements OnInit {

  faPlusCircle = faPlusCircle;

  constructor(public nav:NavbarService,
    public footer:FooterService,private auth:AuthService,private router:Router) { }

  ngOnInit(): void {
    this.nav.hide();
    this.footer.hide();
  }
  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    // this.subscription.unsubscribe();
  }

}
