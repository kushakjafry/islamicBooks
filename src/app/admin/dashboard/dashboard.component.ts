import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { FooterService } from '../../services/footer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  subscription:Subscription;
  constructor(public nav:NavbarService,
    public footer:FooterService,private auth:AuthService,
    private router:Router) { }

  ngOnInit(): void {
    this.nav.hide();
    this.footer.hide();
    this.subscription = this.auth.checkAdmin()
    .subscribe((data) => {
      if(data){
        if(data.success){
          console.log(data.success+'hi success')
        }else{
          this.router.navigate(['/home']);
          console.log('no success');
        }
      }else{
        this.router.navigate(['/home']);
      }
    },(err) => {
      this.router.navigate(['/home']);
    })
  }
  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    this.subscription.unsubscribe();
  }

}
