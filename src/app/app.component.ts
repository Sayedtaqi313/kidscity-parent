import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { NotificationsService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationsService
  ) {
    this.authService.autoLogin();
  }
  title = 'front-user';
  ngOnInit(): void {
    this.notificationService.initialize();
  }
}
