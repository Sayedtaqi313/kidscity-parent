import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SigninComponent } from './components/signin/signin.component';
import { SignupComponent } from './components/signup/signup.component';
import { CoreModule } from '../core/core.module';
import { ActivationComponent } from './components/activation/activation.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-passowrd/forgot-password.component';
import { ResetCodeComponent } from './components/reset-code/reset-code.component';

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    ActivationComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ResetCodeComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, CoreModule],
})
export class AuthModule {}
