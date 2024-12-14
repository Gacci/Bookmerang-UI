import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import Swiper from 'swiper';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

import { AuthService } from '../../services/auth.service';
import { EmailOnly } from '../../interfaces/email-only.interface';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { Registration } from '../../interfaces/registration.interface';

// import { PasswordCheckerComponent } from '../../components/password-checker/password-checker.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

import { passwordMatchValidator } from '../../validators/password-match.validator';

import { signUpGroup, verifyRegisterCodeGroup } from '../form-groups';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [
    CommonModule,
    // PasswordCheckerComponent,
    ReactiveFormsModule,
    RouterModule,
    SpinnerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  providers: []
})
export class SignUpComponent {
  @ViewChild('swiper', { read: ElementRef<SwiperContainer> })
  swiperRefElem!: ElementRef<SwiperContainer>;

  private swiper!: Swiper;

  config: SwiperOptions = {};

  protected createAccountRequest: HttpRequest = {};
  protected resendCreateAccountRequest: HttpRequest = {};
  protected verifyCreateAccountRequest: HttpRequest = {};

  protected signUpGroup = signUpGroup();

  protected verifyRegisterCodeGroup = verifyRegisterCodeGroup();

  protected expiresInSeconds: number = 0;
  protected timerExpiredId!: ReturnType<typeof setTimeout>;

  constructor(private readonly auth: AuthService) {
    this.signUpGroup.addValidators(
      passwordMatchValidator('password', 'confirmed')
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
    this.auth.register(<Registration>this.signUpGroup.value).subscribe({
      next: () => {
        this.startExpiresInCountdown();
      },
      error: () => {
        this.createAccountRequest.done = true;
      },
      complete: () => {
        this.createAccountRequest.done = true;
      }
    });
  }

  handleResendVerifyRegisterCode() {
    this.auth
      .resendCreateAccountCode(<EmailOnly>{ email: this.email.value })
      .subscribe({
        next: () => {
          this.startExpiresInCountdown();
        },
        error: () => {
          this.resendCreateAccountRequest.done = true;
        },
        complete: () => {
          this.resendCreateAccountRequest.done = true;
        }
      });
  }

  handleVerifyRegisterCode() {
    this.auth
      .verifyCreateAccountCode({
        ...this.signUpGroup.value,
        ...this.verifyRegisterCodeGroup.value
      })
      .subscribe({
        next: response => {
          console.log(response);
          this.expiresInSeconds = 0;
        },
        error: () => {
          this.verifyCreateAccountRequest.done = true;
        },
        complete: () => {
          this.verifyCreateAccountRequest.done = true;
        }
      });
  }

  get email() {
    return this.signUpGroup.controls.email;
  }
  get password() {
    return this.signUpGroup.controls.password;
  }
  get confirmed() {
    return this.signUpGroup.controls.confirmed;
  }
}
