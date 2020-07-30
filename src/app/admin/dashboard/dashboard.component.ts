import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { FooterService } from '../../services/footer.service';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { GoogleapiService } from 'src/app/services/googleapi.service';
import { faChartArea,faChartBar,faTable } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  faChartArea=faChartArea;
  faChartBar=faChartBar;
  faTable=faTable;

  errMess:String;
  subscription:Subscription;
  constructor(public nav:NavbarService,
    public footer:FooterService,private auth:AuthService,
    private router:Router,private googleApiService:GoogleapiService) { }

  ngOnInit(): void {
    this.nav.hide();
    this.footer.hide();
    // this.subscription = this.auth.checkAdmin()
    // .subscribe((data) => {
    //   if(data){
    //     if(data.success){
    //       console.log(data.success+'hi success')
    //     }else{
    //       this.router.navigate(['/home']);
    //       console.log('no success');
    //     }
    //   }else{
    //     this.router.navigate(['/home']);
    //   }
    // },(err) => {
    //   this.router.navigate(['/home']);
    // })
    // this.chartsCreate();
  }
  ngOnDestroy(){
    this.nav.show();
    this.footer.show();
    // this.subscription.unsubscribe();
  }
  
  lineChartData: ChartDataSets[] = [{data:[1,2,3,4,5],label:'number'}];
  lineChartLabels: Label[] = ['a','b','c','d','e'];
  lineChartOptions: ChartOptions = {
    responsive: true
  };

  // Define colors of chart segments
  lineChartColors: Color[] = [
    { // red
      backgroundColor: 'rgba(0,0,255,0.3)',
      borderColor: 'blue',
    }
  ];

  // Set true to show legends
  lineChartLegend = true;

  // Define type of chart
  lineChartType = 'line';

  lineChartPlugins = [];

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartsCreate(){
    this.googleApiService.getNewUserData()
    .subscribe(data => {
      this.lineChartData = [
        {data:data.user,label:'No. of user'}
      ];
      this.lineChartLabels = data.date;
    },(err) => this.errMess= err)
  }
}
