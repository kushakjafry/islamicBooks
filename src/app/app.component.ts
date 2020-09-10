import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Meta } from '@angular/platform-browser';
declare let gtag:Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit{
  title = 'ilmofikr';

  ngOnInit() {
    this.metaTagService.addTags([
      { name: 'keywords', content: 'Urdu Literautre Books, Books Library, Free Ebooks,Urdu Islamic Books' },
      { name: 'robots', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'date', content: '2020-08-2', scheme: 'YYYY-MM-DD' },
      { charset: 'UTF-8' }
    ]);
  }

  constructor(public router: Router,public metaTagService:Meta){   
    this.router.events.subscribe(event => {
       if(event instanceof NavigationEnd){
           gtag('config', 'UA-173557744-1', 
                 {
                   'page_path': event.urlAfterRedirects
                 }
            );
        }
     }
  )}
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
