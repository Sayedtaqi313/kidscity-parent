import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';
import { catchError, map, Subject, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ActivityService } from './activity.service';
@Injectable({ providedIn: 'root' })
export class BookingService {
  appUrl = environment.appUrl;
  fileUrl = environment.fileUrl;
  callActivityFunctionSubject$ = new Subject<string>();
  callActivityFunction$ = this.callActivityFunctionSubject$.asObservable();
  callSubscribeFunctionSubject$ = new Subject<boolean>();
  callSubscribeFunction$ = this.callActivityFunctionSubject$.asObservable();
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private router: Router,
    private activityService: ActivityService
  ) {}
  joinActivity(id: string) {
    return this.http.get<any>(`${this.appUrl}/booking/${id}/book`).pipe(
      map((res) => this.processActivityResponse(res)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  cancelActivity(id: string) {
    if (!id) {
      return throwError(() => new Error('Invalid activity ID'));
    }
    return this.http.get<any>(`${this.appUrl}/booking/${id}/cancel`).pipe(
      map((res) => this.processActivityResponse(res)),
      catchError((error) => this.handleAuthError(error))
    );
  }

  private processActivityResponse(res: any) {
    if (res.activity) {
      res.activity.imageUrl = `${this.fileUrl}/${res.activity.imageUrl}`;
      res.activity.timeAgo = this.timeAgo(res.activity.created_at);
    }
    return res;
  }

  private handleAuthError(error: any) {
    if (error.status === 401) {
      this.snackbarService.openSnackbar(
        'You need to login first to perform this action',
        'bg-warning'
      );
      this.router.navigate(['auth/signin']);
    }
    return throwError(error);
  }

  getBookedActivities() {
    return this.http.get<any>(`${this.appUrl}/booking/booked/activities`).pipe(
      map((res) => {
        res.confirmedActivities.forEach((activity: any) => {
          activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
        });
        res.pendingActivities.forEach((activity: any) => {
          activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
        });
        return res;
      })
    );
  }

  timeAgo(date: string | Date) {
    const now = new Date();
    const timeDate = new Date(date);

    if (isNaN(timeDate.getTime())) return 'Invalid date';
    const nowUTC = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    const timeDateUTC = Date.UTC(
      timeDate.getFullYear(),
      timeDate.getMonth(),
      timeDate.getDate(),
      timeDate.getHours(),
      timeDate.getMinutes(),
      timeDate.getSeconds()
    );

    const seconds = Math.floor((nowUTC - timeDateUTC) / 1000);

    if (seconds < 0) return 'Just now'; // Future dates case

    const intervals = [
      { label: 'second', value: 60 },
      { label: 'minute', value: 60 },
      { label: 'hour', value: 24 },
      { label: 'day', value: 30 },
      { label: 'month', value: 12 },
      { label: 'year', value: Infinity },
    ];

    let time = seconds;
    let intervalIndex = 0;
    let interval = intervals[intervalIndex];

    while (time >= interval.value && interval.value !== Infinity) {
      time = Math.floor(time / interval.value);
      intervalIndex++;
      interval = intervals[intervalIndex];
    }

    return `${time} ${interval.label}${time > 1 ? 's' : ''} ago`;
  }
}
