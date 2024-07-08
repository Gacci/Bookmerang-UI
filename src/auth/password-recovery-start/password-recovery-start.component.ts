import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

import { HttpRequest } from '../../interfaces/http-request.interface';

import { changePasswordGroup, startPasswordRecoveryGroup, verifyRequestTokenGroup } from '../form-groups';

@Component({
  selector: 'password-recovery-start',
  standalone: true,
  templateUrl: './password-recovery-start.component.html',
  styleUrl: './password-recovery-start.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent]
})
export class PasswordRecoveryStartComponent {
  protected resetPasswordRequest: HttpRequest = {};
  protected resendPasswordRequest: HttpRequest = {};
  protected verifyCodeRequest: HttpRequest = {};
  protected changePasswordRequest: HttpRequest = {};
  

  protected expiresInSeconds: number = 0;
  protected timerExpiredId: any;

  protected startPasswordRecoveryGroup = startPasswordRecoveryGroup();

  protected verifyRequestTokenGroup = verifyRequestTokenGroup();

  protected changePasswordGroup = changePasswordGroup();

  constructor(private readonly auth: AuthService ) {
    this.changePasswordGroup.addValidators(
      passwordMatchValidator('password', 'confirmed')
    );
  }

  runExpiresInCountdown() {
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
    this.auth.startPasswordRecovery(this.startPasswordRecoveryGroup.value)
      .subscribe({
        next: (response) => {
          this.runExpiresInCountdown();
        },
        error: (e) => {
          this.resetPasswordRequest.done = true;
        },
        complete: () => {
          this.resetPasswordRequest.done = true;
        }
      });

    // const elem = <any>this.swiper.nativeElement;

    // console.log(elem.swiper.slideTo(1))
    
  }

  handleResendRecoveryCode() {
    this.resendPasswordRequest = { sent: true };
    this.auth.resendRecoveryCode(this.startPasswordRecoveryGroup.value)
      .subscribe({
        next: (response) => {
          this.runExpiresInCountdown();
        },
        error: (e) => {
          this.resendPasswordRequest.done = true;
        },
        complete: () => {
          this.resendPasswordRequest.done = true;
        }
      });
  }

  handleVerifyRequestCode() {
    this.verifyCodeRequest = { sent: true };
    this.auth.verifyRecoveryCode({ ...this.startPasswordRecoveryGroup.value, ...this.verifyRequestTokenGroup.value })
      .subscribe({
        next: (response: any) => {
          console.log(
            { 
              ...this.startPasswordRecoveryGroup.value,
              token: response.token
            }
          );

          this.changePasswordGroup.patchValue({ 
            ...this.startPasswordRecoveryGroup.value,
            token: response.token
          });
        },
        error: (e) => {
          this.verifyCodeRequest.done = true;
        },
        complete: () => {
          this.verifyCodeRequest.done = true;
        }
      });
  }

  handleChangePassword() {
    this.verifyCodeRequest = { sent: true };
    this.auth.requestPasswordChange({ ...this.startPasswordRecoveryGroup.value, ...this.changePasswordGroup.value })
      .subscribe({
        next: (response) => {
          
        },
        error: (e) => {
          this.verifyCodeRequest.done = true;
        },
        complete: () => {
          this.verifyCodeRequest.done = true;
        }
      });
  }
}
