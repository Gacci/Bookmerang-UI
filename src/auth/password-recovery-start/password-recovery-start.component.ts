import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

import { HttpRequest } from '../../interfaces/http-request.interface';

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
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SpinnerComponent],
})
export class PasswordRecoveryStartComponent implements AfterViewInit {
  @ViewChild('swiper', { read: ElementRef<SwiperContainer> })
  swiperRefElem!: ElementRef<SwiperContainer>;

  private swiper!: Swiper;

  config: SwiperOptions = {};

  protected resetPasswordRequest: HttpRequest = {};
  protected resendPasswordRequest: HttpRequest = {};
  protected verifyCodeRequest: HttpRequest = {};
  protected changePasswordRequest: HttpRequest = {};

  protected expiresInSeconds: number = 0;
  protected timerExpiredId: any;

  protected startPasswordRecoveryGroup = startPasswordRecoveryGroup();

  protected verifyRequestTokenGroup = verifyRequestTokenGroup();

  protected changePasswordGroup = changePasswordGroup();

  constructor(private readonly auth: AuthService) {
    this.changePasswordGroup.addValidators(passwordMatchValidator('password', 'confirmed'));
  }

  ngAfterViewInit(): void {
    this.swiper = <any>this.swiperRefElem.nativeElement.swiper;
    console.log(this.swiper);
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
    this.auth.startPasswordRecovery(this.startPasswordRecoveryGroup.value).subscribe({
      next: (response) => {
        this.swiper.slideNext();
        this.startExpiresInCountdown();
      },
      error: (e) => {
        this.resetPasswordRequest.done = true;
      },
      complete: () => {
        this.resetPasswordRequest.done = true;
      },
    });
  }

  handleResendRecoveryCode() {
    this.resendPasswordRequest = { sent: true };
    this.auth.resendPasswordRecoveryCode(this.startPasswordRecoveryGroup.value).subscribe({
      next: (response) => {
        this.startExpiresInCountdown();
      },
      error: (e) => {
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
      .verifyPasswordRecoveryCode({
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
        error: (e) => {
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
      .requestPasswordChange({
        ...this.startPasswordRecoveryGroup.value,
        ...this.changePasswordGroup.value,
      })
      .subscribe({
        next: (response) => {
          this.swiper.slideNext();
        },
        error: (e) => {
          this.verifyCodeRequest.done = true;
        },
        complete: () => {
          this.verifyCodeRequest.done = true;
        },
      });
  }


  get email() {
    console.log(
      this.startPasswordRecoveryGroup.controls.email.dirty,
      this.startPasswordRecoveryGroup.controls.email.touched,
      this.startPasswordRecoveryGroup.controls.email.invalid
    );
    return this.startPasswordRecoveryGroup.controls.email;
  }
}
