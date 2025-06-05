import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackbarService } from '../../../core/services/snackbar.service';

@Component({
  selector: 'app-reset-code',
  templateUrl: './reset-code.component.html',
  styleUrls: ['./reset-code.component.css'],
})
export class ResetCodeComponent implements OnInit {
  codeForm: FormGroup;
  isLoading = false;
  email: string | null = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) {
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.email = params.get('email')!;
    });
    if (!this.email) {
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  onSubmit(): void {
    if (this.codeForm.invalid || !this.email) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const code = this.codeForm.value.code;
    this.authService.verifyResetCode(this.email, code).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackbarService.openSnackbar(
          'Code verified successfully!',
          'bg-success'
        );
        this.router.navigate(['/auth/reset-password'], {
          queryParams: { email: this.email, code },
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackbarService.openSnackbar(err.error.message, 'bg-warning');
      },
    });
  }
}
