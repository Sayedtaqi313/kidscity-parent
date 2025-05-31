// reset-password.component.ts

import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  private code: string | null = null;
  private email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.code = this.route.snapshot.queryParamMap.get('code');

    if (!this.email || !this.code) {
      this.snackbar.openSnackbar(
        'Invalid reset link. Please request a new code.',
        'bg-warning'
      );
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  private passwordsMatch(c: AbstractControl): ValidationErrors | null {
    const pw = c.get('password')?.value;
    const cpw = c.get('confirmPassword')?.value;
    return pw && cpw && pw !== cpw ? { mismatch: true } : null;
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.email || !this.code) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const newPassword = this.resetForm.value.password;

    this.authService
      .resetPassword({
        email: this.email,
        code: this.code,
        password: newPassword,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.snackbar.openSnackbar(
            'Password reset successfully!',
            'bg-success'
          );
          this.router.navigate(['/auth/signin']);
        },
        error: (err: any) => {
          this.isLoading = false;
          this.snackbar.openSnackbar(err.error.message, 'bg-warning');
        },
      });
  }
}
