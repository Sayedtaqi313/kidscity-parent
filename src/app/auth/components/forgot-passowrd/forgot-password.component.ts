import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const email = this.forgotPasswordForm.value.email;
    console.log('email', email);
    this.authService.requestReset(email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.snackbarService.openSnackbar(
          res.message || 'A verification code has been sent to you email',
          'bg-success'
        );
        this.router.navigate([
          '/auth/reset-code',
          this.forgotPasswordForm.value.email,
        ]);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackbarService.openSnackbar(err.error.message, 'bg-warning');
      },
    });
  }
}
