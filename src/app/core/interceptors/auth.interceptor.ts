import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { signinResponse } from '../types/signin-response.type';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/refresh_token')) {
      return next.handle(req);
    }
    const access_token = this.authService.getAccess_token();

    if (access_token) {
      const authReq = this.addTokenHeader(req, access_token);
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return this.handleExpiredToken(authReq, next);
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(req);
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handleExpiredToken(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(
        switchMap((res: signinResponse) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(res.access_token);
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          this.authService.setStorages(res, rememberMe);
          return next.handle(this.addTokenHeader(req, res.access_token));
        }),
        catchError(() => {
          this.isRefreshing = false;
          this.authService.logout();
          return EMPTY;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(req, token!)))
      );
    }
  }
}
