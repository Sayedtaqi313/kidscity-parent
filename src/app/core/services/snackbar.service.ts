import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private messageSubject = new BehaviorSubject<string | null>(null);
  private colorSubject = new BehaviorSubject<string | null>(null);

  message$ = this.messageSubject.asObservable();
  color$ = this.colorSubject.asObservable();

  openSnackbar(message: string, bgColor: string) {
    this.messageSubject.next(message);
    this.colorSubject.next(bgColor);

    setTimeout(() => {
      this.messageSubject.next(null);
    }, 10000);
  }
}
