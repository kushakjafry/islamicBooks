import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private titleService: Title,
    private metaTagService: Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle('ilmofikr')
    this.metaTagService.addTag(
      {name: 'description', content:'A website for free pdf urdu and islamic books'}
    )
  }

}
