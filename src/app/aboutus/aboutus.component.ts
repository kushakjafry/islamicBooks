import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {

  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('About us');
      this.metaTagService.addTag(
      {name:'description',content:'Want to know more about us check out the page'}
    )
  }

}
