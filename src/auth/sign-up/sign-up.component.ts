import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

import { signUpGroup, verifyRegisterCodeGroup } from '../form-groups';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  protected createAccountRequest: HttpRequest = {};
  protected resendCreateAccountRequest: HttpRequest = {};
  protected verifyCreateAccountRequest: HttpRequest = {};

  protected signUpGroup = signUpGroup();

  protected verifyRegisterCodeGroup = verifyRegisterCodeGroup();

  protected expiresInSeconds: number = 0;
  protected timerExpiredId: any;

  constructor(private readonly auth: AuthService) {
    this.signUpGroup.addValidators(
      passwordMatchValidator('password', 'confirmed'),
    );
  }

  startExpiresInCountdown() {
    this.expiresInSeconds = 60;
    if (this.timerExpiredId) {
      clearInterval(this.timerExpiredId);
    }

    this.timerExpiredId = setInterval(() => {
      this.expiresInSeconds--;
      if (this.expiresInSeconds <= 0) {
        clearInterval(this.timerExpiredId);
      }
    }, 1000);
  }

  handleSignUp() {
    this.createAccountRequest = { sent: true };
    this.auth.register(this.signUpGroup.value).subscribe({
      next: (response) => {
        console.log(response);
        this.startExpiresInCountdown();
      },
      error: (e) => {
        this.createAccountRequest.done = true;
      },
      complete: () => {
        this.createAccountRequest.done = true;
      },
    });
  }

  handleResendVerifyRegisterCode() {
    this.auth
      .resendCreateAccountCode({ email: this.signUpGroup.controls.email.value })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.startExpiresInCountdown();
        },
        error: (e) => {
          this.resendCreateAccountRequest.done = true;
        },
        complete: () => {
          this.resendCreateAccountRequest.done = true;
        },
      });
  }

  handleVerifyRegisterCode() {
    this.auth
      .verifyCreateAccountCode({ ...this.signUpGroup.value, ...this.verifyRegisterCodeGroup.value})
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (e) => {
          this.verifyCreateAccountRequest.done = true;
        },
        complete: () => {
          this.verifyCreateAccountRequest.done = true;
        },
      });
  }
}
