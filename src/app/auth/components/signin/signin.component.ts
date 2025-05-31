import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-angular';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-sign-in',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  mail = Mail;
  arrowLeft = ArrowLeft;
  lock = Lock;
  eye = Eye;
  yeOff = EyeOff;
  signinForm: FormGroup;
  passwordVisible: boolean = false;
  checked: boolean = false;
  isLoading: boolean = false;
  isGoogleLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    Object.values(this.signinForm.controls).forEach((control) =>
      control.markAllAsTouched()
    );
    if (this.signinForm.invalid) return;
    this.isLoading = true;
    this.authService
      .signin(this.signinForm.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.snackbarService.openSnackbar(
            'Welocome to you account',
            'bg-success'
          );
        },
        error: (err) => {
          this.snackbarService.openSnackbar(err, 'bg-warning');
          this.isLoading = false;
        },
      });
  }

  signInWithGoogle() {
    this.isGoogleLoading = true;
    try {
      this.authService.signinWithGoogle();
    } catch (err) {
    } finally {
      this.isGoogleLoading = false;
    }
  }
}
