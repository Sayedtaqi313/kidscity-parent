import { signinResponse } from './../types/signin-response.type';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SignupData } from '../types/signup-form.type';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SigninData } from '../types/signin-form.type';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private appUrl = environment.appUrl;
  private fileUrl = environment.fileUrl;
  private autoLogoutTimer: any;
  isAuthenticatedSubject = new BehaviorSubject<boolean | null>(null);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  signup(formData: SignupData): Observable<any> {
    return this.http
      .post<any>(`${this.appUrl}/user/signup/subscriber`, formData)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  signin(data: SigninData) {
    const { rememberMe } = data;
    return this.http
      .post<signinResponse>(`${this.appUrl}/auth/subscriber/signin`, data)
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        tap((res: signinResponse) => {
          this.setStorages(res, rememberMe);
          this.setTimerToRefresh(res.expires_in);
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/home']);
        })
      );
  }
  logout() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/auth/signin']);
    this.isAuthenticatedSubject.next(false);
  }
  public setStorages(res: any, rememberMe: boolean = false): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const { access_token, refresh_token, expires_in, user } = res;
    if (user.imageUrl && !user.imageUrl.startsWith('https')) {
      user.imageUrl = `${this.fileUrl}/profiles/${user.imageUrl}`;
    }
    const expirationDate = Date.now() + expires_in * 1000;
    localStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('access_token', access_token);
    sessionStorage.setItem('refresh_token', refresh_token);
    sessionStorage.setItem('expires_in', expirationDate.toString());

    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expirationDate.toString());
    }
  }
  getUser() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')!)
        : null;
    }

    return null;
  }
  setTimerToRefresh(expires_in: number) {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
    const timer = (expires_in - 10) * 1000;
    this.autoLogoutTimer = setTimeout(() => {
      this.refreshTokenByTimer();
    }, timer);
  }

  refreshTokenByTimer() {
    this.refreshToken().subscribe({
      next: (res: signinResponse) => {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        this.setStorages(res, rememberMe);
        this.setTimerToRefresh(res.expires_in);
      },
      error: (error) => {
        this.logout();
      },
    });
  }

  autoLogin() {
    if (isPlatformBrowser(this.platformId)) {
      const expires_in = localStorage.getItem('rememberMe')
        ? localStorage.getItem('expires_in')
        : sessionStorage.getItem('expires_in');
      if (expires_in) {
        const isValidTime = (Number(expires_in) - new Date().getTime()) / 1000;
        if (isValidTime > 5) {
          this.isAuthenticatedSubject.next(true);
          this.setTimerToRefresh(isValidTime);
        } else {
          this.logout();
        }
      } else {
        this.isAuthenticatedSubject.next(false);
      }
    }
  }

  getAccess_token() {
    if (isPlatformBrowser(this.platformId)) {
      return (
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      );
    }
    return null;
  }

  getRefresh_token() {
    if (isPlatformBrowser(this.platformId)) {
      return (
        localStorage.getItem('refresh_token') ||
        sessionStorage.getItem('refresh_token')
      );
    }
    return null;
  }

  refreshToken(): Observable<any> {
    const refresh_token = this.getRefresh_token();
    const headers = new HttpHeaders({
      token: `${refresh_token}`,
    });
    return this.http.get<any>(`${this.appUrl}/auth/subscriber/refresh_token`, {
      headers,
    });
  }

  signinWithGoogle() {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = `${this.appUrl}/auth/google`;
    }
  }
  check(pin: string) {
    this.http
      .post<any>(`${this.appUrl}/auth/check`, { pin, role: 'subscriber' })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)))
      .subscribe({
        next: (res: signinResponse) => {
          this.setStorages(res);
          this.setTimerToRefresh(res.expires_in);
          this.isAuthenticatedSubject.next(true);
          this.router.navigate(['/home']);
        },
        error: (err) =>
          this.snackbarService.openSnackbar(err.message, 'bg-warning'),
      });
  }

  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.appUrl}/auth/verify-code`, {
      email,
      code,
    });
  }

  resendCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.appUrl}/auth/resend-code`, { email });
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = this.getErrorMessage(error);
    return throwError(() => new Error(errorMessage));
  }

  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post<any>(`${this.appUrl}/auth/verify-reset-code`, {
      email,
      code,
    });
  }

  resetPassword(data: any) {
    return this.http.post<any>(`${this.appUrl}/auth/reset-password`, data);
  }
  requestReset(email: string): Observable<any> {
    return this.http.post<any>(`${this.appUrl}/auth/forgot-password`, {
      email,
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 400:
        return error.error.message;
      case 401:
        return 'Invalid credentials';
      case 409:
        return 'Email already in use';
      default:
        return 'An unknown error occurred';
    }
  }
}
