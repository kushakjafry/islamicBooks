import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { FooterService } from '../../services/footer.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
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
    this.chartsCreate();
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

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
  };
  searchBarChartLabels: Label[] = ['a','b','c','d','e'];
  searchBarChartType: ChartType = 'bar';
  searchBarChartLegend = true;
  searchBarChartPlugins = [];

  searchBarChartData: ChartDataSets[] = [
    { data:[1,2,3,4,5], label: 'search' }
  ];



  bookBarChartLabels: Label[] = ['a','b','c','d','e'];
  bookBarChartType: ChartType = 'bar';
  bookBarChartLegend = true;
  bookhBarChartPlugins = [];

  bookBarChartData: ChartDataSets[] = [
    { data:[1,2,3,4,5], label: 'search' }
  ];


  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[0].data[tooltipItems.index] + ' %';
        }
      }
    },
  };

  pieChartLabels: Label[] = ['Nitrogen', 'Oxygen', 'Argon', 'Carbon dioxide'];

  pieChartData: number[] = [60.00, 20.95, 0.93, 0.03];

  pieChartType: ChartType = 'pie';

  pieChartLegend = true;

  pieChartPlugins = [];

  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)','rgba(200,210,94,1)','rgba(208,96,227,1)','#aaedf7'],
    },
  ];

  chartsCreate(){
    this.googleApiService.getNewUserData()
    .subscribe(data => {
      this.lineChartData = [
        {data:data.user,label:'No. of user'}
      ];
      this.lineChartLabels = data.date;
    },(err) => this.errMess= err)
    this.googleApiService.getSearchData()
    .subscribe(search => {
      this.searchBarChartLabels = search.search;
      this.searchBarChartData = [
        { data: search.Key, label :'search'}
      ]
    },(err) => this.errMess= err)
    this.googleApiService.getBooksData()
    .subscribe(book => {
      this.bookBarChartLabels = book.book;
      this.bookBarChartData =[
        {data: book.search,label:'book'}
      ]
    },(err) => this.errMess= err);
    this.googleApiService.getPagesData()
    .subscribe(pages => {
      console.log(pages.percent)
      this.pieChartLabels = pages.page;
      this.pieChartData = pages.percent;
    })
  }
}
