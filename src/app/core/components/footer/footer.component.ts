import { Component } from '@angular/core';
import { Linkedin, Facebook, Youtube } from 'lucide-angular';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  linkedin = Linkedin;
  facebook = Facebook;
  youtube = Youtube;
}
