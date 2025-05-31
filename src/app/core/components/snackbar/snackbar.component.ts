import { Component } from '@angular/core';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.css'],
})
export class SnackbarComponent {
  message$;
  bgColor$;
  success: boolean = false;
  warning: boolean = false;
  constructor(private snackbarService: SnackbarService) {
    this.message$ = this.snackbarService.message$;
    this.bgColor$ = this.snackbarService.color$;
    this.bgColor$.subscribe((value) => {
      if (value !== null) {
        switch (value) {
          case 'bg-warning':
            this.success = false;
            this.warning = true;
            break;
          case 'bg-success':
            this.success = true;
            this.warning = false;
        }
      }
    });
  }

  closeSnackbar() {
    this.snackbarService.openSnackbar('', '');
  }
}
