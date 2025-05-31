import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { SearchInterface } from '../types/search.interface';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = environment.appUrl;
  private fileUrl = environment.fileUrl;

  constructor(private http: HttpClient) {}

  search(dto: SearchInterface): Observable<{
    activities: any[];
    alternativeActivities: any[];
  }> {
    return this.http
      .post<{ activities: any[]; alternativeActivities: any[] }>(
        `${this.apiUrl}/activities/search`,
        dto
      )
      .pipe(
        map((res) => {
          const normalize = (list: any[]) =>
            list.map((activity) => {
              if (!activity.imageUrl.startsWith('http')) {
                activity.imageUrl = `${this.fileUrl}/${activity.imageUrl}`;
              }
              activity.timeAgo = this.timeAgo(activity.created_at);
              return activity;
            });

          return {
            activities: normalize(res.activities || []),
            alternativeActivities: normalize(res.alternativeActivities || []),
          };
        })
      );
  }

  private timeAgo(date: string | Date): string {
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
    const thenUTC = Date.UTC(
      timeDate.getFullYear(),
      timeDate.getMonth(),
      timeDate.getDate(),
      timeDate.getHours(),
      timeDate.getMinutes(),
      timeDate.getSeconds()
    );

    const seconds = Math.floor((nowUTC - thenUTC) / 1000);
    if (seconds < 0) return 'Just now';

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
    while (time >= intervals[idx].value && intervals[idx].value !== Infinity) {
      time = Math.floor(time / intervals[idx].value);
      idx++;
    }
    const label = intervals[idx].label + (time > 1 ? 's' : '');
    return `${time} ${label} ago`;
  }
}
