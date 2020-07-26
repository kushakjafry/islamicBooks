import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FooterService {

  visible:Boolean = true;
  constructor() { }

  hide(){
    this.visible = false;
  }
  show(){
    this.visible = true;
  }
  toggle(){
    this.visible = !this.visible;
  }
}
