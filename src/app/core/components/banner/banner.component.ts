import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Sparkles } from 'lucide-angular';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent {
  Sparkles = Sparkles;

  scrollToHomeContent(): void {
    const homeContent = document.getElementById('home-content');
    if (homeContent) {
      homeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  constructor() {}
}
