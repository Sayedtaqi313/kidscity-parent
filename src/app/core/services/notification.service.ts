import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private socket!: Socket;
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  public count$ = this.notifications$.pipe(map((list) => list.length));

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  initialize(): void {
    this.loadInitialNotifications().subscribe({
      next: () => {
        if (isPlatformBrowser(this.platformId)) {
          const user = this.auth.getUser();
          if (!user) return;
          this.setupWebSocket(user.userId);
        }
      },
      error: (err) => console.error('Initialization failed:', err),
    });
  }

  private setupWebSocket(userId: string): void {
    this.socket = io(environment.socketUrl, {
      transports: ['websocket'],
      query: { userId },
    });

    this.socket.on('connect', () =>
      console.log('Socket connected:', this.socket.id)
    );
    this.socket.on('connect_error', (err) =>
      console.error('Socket connection error:', err)
    );

    this.socket.on('notification', (payload: any) => {
      const transformed = this.transformPayload(payload);
      console.log('payload', transformed);
      const current = this.notificationsSubject.value;
      if (!current.find((n) => n.id === transformed.id)) {
        this.notificationsSubject.next([transformed, ...current]);
      }
    });
  }

  markAsRead(id: string) {
    return this.http.post<any>(
      `${environment.appUrl}/notifications/${id}/read`,
      {}
    );
  }

  private loadInitialNotifications() {
    const user = this.auth.getUser();
    if (!user) return of([]);

    return this.http.get<any[]>(`${environment.appUrl}/notifications`).pipe(
      map((list) => list.map((p) => this.transformPayload(p))),
      tap((list) => this.notificationsSubject.next(list)),
      catchError((err) => {
        console.error('Failed to load notifications:', err);
        return of([]);
      })
    );
  }

  private transformPayload(payload: any): any {
    if (payload.activity?.imageUrl) {
      payload.activity.imageUrl = `${environment.fileUrl}/${payload.activity.imageUrl}`;
    }
    if (payload.sender?.profileUrl) {
      payload.sender.profileUrl = `${environment.fileUrl}/${payload.sender.profileUrl}`;
    }
    payload.created_at = this.timeAgo(payload.created_at);
    return payload;
  }

  private timeAgo(dateInput: string | Date): string {
    const now = new Date();
    const past = new Date(dateInput);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    const intervals = [
      { label: 'second', value: 60 },
      { label: 'minute', value: 60 },
      { label: 'hour', value: 24 },
      { label: 'day', value: 30 },
      { label: 'month', value: 12 },
      { label: 'year', value: Infinity },
    ];

    let time = seconds;
    let idx = 0;
    while (time >= intervals[idx].value) {
      time = Math.floor(time / intervals[idx].value);
      idx++;
    }
    const { label } = intervals[idx];
    return `${time} ${label}${time !== 1 ? 's' : ''} ago`;
  }
}
