import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})



export class AppComponent {
  title = 'islamicbooks';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
     if (event instanceof NavigationEnd) {
       (<any>window).ga('set', 'page', event.urlAfterRedirects);
       (<any>window).ga('send', 'pageview');
     }
   });
 }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
