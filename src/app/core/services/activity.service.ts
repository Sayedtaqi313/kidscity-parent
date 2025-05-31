import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';
import { LocationService } from './location.service';
import { BookingService } from './booking.service';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private locationService: LocationService,
    private location: Location,
    @Inject(PLATFORM_ID) private platFormId: any
  ) {}
  appUrl = environment.appUrl;
  fileUrl = environment.fileUrl;

  getActivities() {
    return this.http.get<any>(`${this.appUrl}/activities/subscriber`).pipe(
      map((res) => {
        res.activities.forEach((activity: any) => {
          if (!activity.imageUrl.startsWith('http')) {
            activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
          }
          activity.location = this.formatLocation(activity.location);
          activity.created_at = this.timeAgo(activity.created_at);
        });
        res.alternativeActivities.forEach((activity: any) => {
          if (!activity.imageUrl.startsWith('http')) {
            activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
          }
          activity.location = this.formatLocation(activity.location);
          activity.created_at = this.timeAgo(activity.created_at);
        });
        return res;
      })
    );
  }
  getActivityByType(type: string): Observable<any> {
    let exploreType = '';
    switch (type) {
      case 'Indoor':
        exploreType = 'indoor';
        break;
      case 'Outdoor':
        exploreType = 'outdoor';
        break;
    }
    return this.http
      .post<any>(`${this.appUrl}/activities/subscriber/type/getAll`, {
        exploreType,
      })
      .pipe(
        map((res) => {
          res.activities.forEach((activity: any) => {
            activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
            activity.created_at = this.timeAgo(activity.created_at);
            activity.location = this.formatLocation(activity.location);
          });
          res.alternativeActivities.forEach((activity: any) => {
            activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
            activity.created_at = this.timeAgo(activity.created_at);
            activity.location = this.formatLocation(activity.location);
          });

          return res;
        }),
        catchError((error) => {
          console.error(error);
          return throwError(error);
        })
      );
  }

  getActivityByLocation(exploreType: string): Observable<any> {
    return from(this.locationService.getCurrentLocation()).pipe(
      catchError((error) => {
        if (exploreType == 'In') {
          this.snackbarService.openSnackbar(
            'Please enable location access to see activities in your city!',
            'bg-warning'
          );
        } else {
          this.snackbarService.openSnackbar(
            'Please enable location access to explore activities outside your city!',
            'bg-warning'
          );
        }
        if (isPlatformBrowser(this.platFormId)) {
          this.location.back();
        }
        return throwError(error);
      }),
      switchMap(({ lat, lng }) => {
        return this.locationService.getLocationName(lat, lng);
      }),
      switchMap((data: any) => {
        const location = data.results[0].formatted;
        return this.http.post<any>(
          `${this.appUrl}/activities/subscriber/location/getAll`,
          {
            exploreType,
            location,
          }
        );
      }),
      map((res) => {
        res.activities.forEach((activity: any) => {
          activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
          activity.timeAgo = this.timeAgo(activity.created_at);
          activity.location = this.formatLocation(activity.location);
        });
        res.alternativeActivities.forEach((activity: any) => {
          activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
          activity.timeAgo = this.timeAgo(activity.created_at);
          activity.location = this.formatLocation(activity.location);
        });

        return res;
      }),
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  getActivityById(id: string) {
    return this.http
      .get<any>(`${this.appUrl}/activities/subscriber/${id}/activity`)
      .pipe(
        map((activity: any) => {
          if (!activity.imageUrl.startsWith('http')) {
            activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
          }
          activity.timeAgo = this.timeAgo(activity.created_at);
          return activity;
        })
      );
  }

  formatLocation(location: string) {
    const parts = location.split(',').map((part) => part.trim());

    if (parts.length < 2) return location;

    const city = parts[0];
    const country = parts[parts.length - 1];

    return `${city}, ${country}`;
  }

  timeAgo(date: string | Date) {
    const now = new Date();
    const timeDate = new Date(date);

    if (isNaN(timeDate.getTime())) return 'Invalid date'; // Handle invalid dates

    // Convert both timestamps to UTC
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
