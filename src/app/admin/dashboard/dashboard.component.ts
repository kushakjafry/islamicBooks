import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/services/navbar.service';
import { FooterService } from '../../services/footer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public nav:NavbarService,
    public footer:FooterService) { }

  ngOnInit(): void {
    this.nav.hide();
    this.footer.hide();
  }

}
