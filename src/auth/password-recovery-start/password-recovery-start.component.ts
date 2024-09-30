import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';

import { PasswordCheckerComponent } from '../../components/password-checker/password-checker.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

import { passwordMatchValidator } from '../../validators/password-match.validator';

import { CodeOnly } from '../../interfaces/code-only.interface';
import { EmailOnly } from '../../interfaces/email-only.interface';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { Registration } from '../../interfaces/registration.interface';

import {
  changePasswordGroup,
  startPasswordRecoveryGroup,
  verifyRequestTokenGroup,
} from '../form-groups';

import { Swiper, SwiperOptions } from 'swiper/types';
import { SwiperContainer } from 'swiper/element';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'password-recovery-start',
  standalone: true,
  templateUrl: './password-recovery-start.component.html',
  styleUrl: './password-recovery-start.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    PasswordCheckerComponent,
    ReactiveFormsModule,
    RouterModule,
    SpinnerComponent,
  ],
})
export class PasswordRecoveryStartComponent implements AfterViewInit {
  @ViewChild('swiper', { read: ElementRef<SwiperContainer> })
  swiperRefElem!: ElementRef<SwiperContainer>;

  private swiper!: Swiper;

  config: SwiperOptions = {
    autoHeight: true,
  };

  protected resetPasswordRequest: HttpRequest = {};
  protected resendPasswordRequest: HttpRequest = {};
  protected verifyCodeRequest: HttpRequest = {};
  protected changePasswordRequest: HttpRequest = {};

  protected expiresInSeconds: number = 0;
  protected timerExpiredId!: ReturnType<typeof setTimeout>;

  protected startPasswordRecoveryGroup = startPasswordRecoveryGroup();

  protected verifyRequestTokenGroup = verifyRequestTokenGroup();

  protected changePasswordGroup = changePasswordGroup();

  constructor(private readonly auth: AuthService) {
    this.changePasswordGroup.addValidators(
      passwordMatchValidator('password', 'confirmed'),
    );
  }

  ngAfterViewInit(): void {
    this.swiper = <Swiper>(<unknown>this.swiperRefElem.nativeElement.swiper);
    this.swiper.update();
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

  handleStartRecovery() {
    this.resetPasswordRequest = { sent: true };
    this.auth
      .startPasswordRecovery(<EmailOnly>this.startPasswordRecoveryGroup.value)
      .subscribe({
        next: () => {
          this.startExpiresInCountdown();
          this.swiper.slideNext();
        },
        error: () => {
          this.resetPasswordRequest.done = true;
        },
        complete: () => {
          this.resetPasswordRequest.done = true;
        },
      });
  }

  handleResendRecoveryCode() {
    this.resendPasswordRequest = { sent: true };
    this.auth
      .resendPasswordRecoveryCode(<EmailOnly>this.startPasswordRecoveryGroup.value)
      .subscribe({
        next: () => {
          this.startExpiresInCountdown();
        },
        error: () => {
          this.resendPasswordRequest.done = true;
        },
        complete: () => {
          this.resendPasswordRequest.done = true;
        },
      });
  }

  handleVerifyRequestCode() {
    this.verifyCodeRequest = { sent: true };
    this.auth
      .verifyPasswordRecoveryCode(<EmailOnly & CodeOnly>{
        ...this.startPasswordRecoveryGroup.value,
        ...this.verifyRequestTokenGroup.value,
      })
      .subscribe({
        next: (response: any) => {
          this.expiresInSeconds = 0;
          this.swiper.slideNext();
          this.changePasswordGroup.patchValue({
            ...this.startPasswordRecoveryGroup.value,
            token: response.token,
          });
        },
        error: () => {
          this.verifyCodeRequest.done = true;
        },
        complete: () => {
          this.verifyCodeRequest.done = true;
        },
      });
  }

  handleChangePassword() {
    this.verifyCodeRequest = { sent: true };
    this.auth
      .requestPasswordChange(<Registration & CodeOnly>{
        ...this.startPasswordRecoveryGroup.value,
        ...this.changePasswordGroup.value,
      })
      .subscribe({
        next: () => {
          this.disableGroupControls(this.changePasswordGroup);
          this.disableGroupControls(this.startPasswordRecoveryGroup);
          this.disableGroupControls(this.verifyRequestTokenGroup);
          this.swiper.slideNext();
        },
        error: () => {
          // this.verifyCodeRequest.done = true;
        },
        complete: () => {
          // this.verifyCodeRequest.done = true;
        },
      });
  }

  private disableGroupControls(group: FormGroup) {
    Object.keys(group.controls)
      .map((key) => group.controls[key])
      .forEach((ctrl) => {
        ctrl.disable();
        ctrl.markAsPristine();
        ctrl.markAsUntouched();
        ctrl.reset();
      });
  }

  get email() {
    return this.startPasswordRecoveryGroup.controls.email;
  }

  get password() {
    return this.changePasswordGroup.controls.password;
  }

  get confirmed() {
    return this.changePasswordGroup.controls.confirmed;
  }

  get maskedEmail() {
    const value = <string>(this.email.value ?? '');
    if (!value) {
      return undefined;
    }

    const pos = value.indexOf('@');
    return value
      .split('')
      .map((chr, index) => (index >= 3 && index < pos - 2 ? '*' : chr))
      .join('');
  }
}
