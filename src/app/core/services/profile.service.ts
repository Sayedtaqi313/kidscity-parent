import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, tap } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({ providedIn: 'root' })
export class ProfileService {
  appUrl = environment.appUrl;
  fileUrl = environment.fileUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  changeProfileImage(data: any) {
    return this.http.post(`${this.appUrl}/user/profile/image`, data).pipe(
      map((res: any) => {
        res.imageUrl = `${this.fileUrl}/profiles/${res.imageUrl}`;
        return res;
      }),
      tap((res) => {
        let user = this.authService.getUser();
        user.imageUrl = res.imageUrl;
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  updateUserProfile(data: any) {
    return this.http
      .put<any>(`${this.appUrl}/user/subscriber/profile/update`, data)
      .pipe(
        tap((res) => {
          if (res.status == 200) {
            let user = this.authService.getUser();
            user.firstName = res.firstName;
            user.lastName = res.lastName;
            localStorage.setItem('user', JSON.stringify(user));
          }
        })
      );
  }
}
