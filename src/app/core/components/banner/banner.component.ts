import { Component, OnInit } from '@angular/core';
import { Sparkles } from 'lucide-angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  Sparkles = Sparkles;
  appName: string = '';
  isCreator: boolean = false;
  appUrl: string = '';

  constructor() {}

  ngOnInit(): void {
    this.appName = environment.appName;
    if (this.appName === 'creator') {
      this.appUrl = environment.subscriberUrl;
    } else if (this.appName === 'subscriber') {
      this.appUrl = environment.creatorUrl;
    }
  }

  scrollToHomeContent(): void {
    const homeContent = document.getElementById('home-content');
    if (homeContent) {
      homeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  switch() {
    window.open(this.appUrl, '_blank');
  }
}
