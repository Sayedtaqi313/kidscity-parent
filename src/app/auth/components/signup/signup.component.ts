import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordPattern } from '../../../core/types/password-pattern.type';
import { AuthService } from '../../../core/services/auth.service';
import { SignupData } from '../../../core/types/signup-form.type';
import { SnackbarService } from '../../../core/services/snackbar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  passwordVisible: boolean = false;
  isLoading: boolean = false;
  isGoogleLoading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(passwordPattern),
          Validators.minLength(8),
        ],
      ],
    });
  }
  ngOnInit(): void {}

  onSubmit() {
    Object.values(this.signupForm.controls).forEach((control) =>
      control.markAllAsTouched()
    );

    if (this.signupForm.invalid) return;
    this.isLoading = true;
    const formData: SignupData = this.signupForm.value;
    this.authService.signup(formData).subscribe({
      next: (res) => {
        this.snackbarService.openSnackbar(res.message, 'bg-success');
        this.isLoading = false;
        this.router.navigate(['/auth/activation', this.signupForm.value.email]);
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
