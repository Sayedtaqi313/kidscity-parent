import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  private subs = new Subscription();

  constructor(
    private notificationsService: NotificationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationsService.initialize();
    this.subs.add(
      this.notificationsService.notifications$.subscribe((list) => {
        this.notifications = list;
      })
    );
  }

  markAsRead(id: string) {
    this.notificationsService.markAsRead(id).subscribe();
  }

  navigateToDetail(id: string) {
    this.router.navigate(['/home', 'all', id, 'activity']);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
