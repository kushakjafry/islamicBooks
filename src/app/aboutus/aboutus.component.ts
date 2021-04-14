import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounce } from 'ng-animate';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss'],
  animations: [trigger('bounce', [transition('* => *', useAnimation(bounce))])],
})
export class AboutusComponent implements OnInit {
  constructor(private titleService: Title, private metaTagService: Meta) {}
  bounce = bounce;
  ngOnInit(): void {
    this.titleService.setTitle('About us');
    this.metaTagService.addTag({
      name: 'description',
      content: 'Want to know more about us check out the page',
    });
  }
}
