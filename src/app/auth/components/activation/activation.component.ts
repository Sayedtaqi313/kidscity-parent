import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css'],
})
export class ActivationComponent implements OnInit {
  activationForm: FormGroup;
  isLoading = false;
  isResending = false;
  countdown = 0;
  message = '';
  messageType: 'success' | 'error' | null = null;
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.activationForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.email = params.get('email')!;
    });
    this.startCountdown();
  }

  onSubmit() {
    if (this.activationForm.invalid) return;
    this.isLoading = true;
    const code = this.activationForm.value.code;
    this.authService.verifyCode(this.email, code).subscribe({
      next: () => {
        this.snackbarService.openSnackbar(
          'Code verified successfully!',
          'bg-success'
        );
        this.router.navigate(['/auth/signin']);
      },
      error: (err) => {
        this.snackbarService.openSnackbar(
          err.error?.message || 'Verification failed',
          'bg-warning'
        );
        this.isLoading = false;
      },
    });
  }

  resendCode() {
    this.isResending = true;
    this.authService.resendCode(this.email).subscribe({
      next: () => {
        this.snackbarService.openSnackbar(
          'New code has been sent to your email',
          'bg-success'
        );
        this.startCountdown(100);
        this.isResending = false;
      },
      error: (err: any) => {
        this.snackbarService.openSnackbar(
          err.error?.message || 'Resend failed',
          'bg-warning'
        );
        this.isResending = false;
      },
    });
  }

  startCountdown(seconds = 30) {
    this.countdown = seconds;
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) clearInterval(interval);
    }, 1000);
  }
}
