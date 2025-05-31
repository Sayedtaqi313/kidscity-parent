import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  apiKey = '7eb43432b544467d82de0248c1ece461';
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}
  getGeoLocationSuggestion(query: string) {
    return this.http
      .get(
        `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${this.apiKey}`
      )
      .pipe(map((res: any) => res.results || []));
  }

  getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    if (isPlatformBrowser(this.platformId)) {
      return new Promise((resolve, reject) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            (error) => {
              reject('Geolocation permission denied or unavailable.');
            }
          );
        } else {
          reject('Geolocation is not supported by this browser.');
        }
      });
    } else {
      return Promise.reject('Geolocation is not available on the server.');
    }
  }

  getLocationName(lat: number, lng: number) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
