import { Component, OnInit } from '@angular/core';
import { FooterService } from '../services/footer.service';
import { faPhone,faFax,faEnvelope} from '@fortawesome/free-solid-svg-icons';
import { faFacebook,faYoutube,faGithub,faInstagram,faTwitter,faLinkedin } from '@fortawesome/free-brands-svg-icons';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  faPhone=faPhone;
  faFax=faFax;
  faEnvelope=faEnvelope;
  faFacebook=faFacebook;
  faYoutube=faYoutube;
  faGithub=faGithub;
  faInstagram=faInstagram;
  faTwitter=faTwitter;
  faLinkedin=faLinkedin;

  constructor(public footer:FooterService) { }

  ngOnInit(): void {
  }

}
