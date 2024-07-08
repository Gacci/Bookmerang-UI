// import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

import { HttpRequest } from '../../interfaces/http-request.interface';


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

  private validators = {
    email: [ Validators.required, Validators.email, Validators.pattern(/^.+@([a-z]+\.)?[a-z]+\.[a-z]{2,3}$/) ],
    token: [ Validators.required, Validators.pattern(/[A-Z0-9]{6}/) ]
  };
  
  

  protected startPasswordRecoveryGroup: FormGroup = new FormGroup({
    email: new FormControl(null, this.validators.email)
  });

  protected verifyRequestTokenGroup: FormGroup = new FormGroup({
    token: new FormControl(null, this.validators.token)
  });

  protected changePasswordGroup: FormGroup = new FormGroup({
    password: new FormControl(null, [ Validators.required ]),
    confirmed: new FormControl(null, [ Validators.required ]),
    token: new FormControl(null, this.validators.token),
    email: new FormControl(null, this.validators.email)
  });

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.changePasswordGroup.addValidators(passwordMatchValidator('password', 'confirmed'));
    // this.fb.group({});
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
    this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/start', this.startPasswordRecoveryGroup.value)
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
    this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/resend-request', this.startPasswordRecoveryGroup.value)
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
    console.log('justo.jonathan@gmail.com')
    this.verifyCodeRequest = { sent: true };
    this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/verify', { ...this.startPasswordRecoveryGroup.value, ...this.verifyRequestTokenGroup.value })
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
    this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/reset', { ...this.startPasswordRecoveryGroup.value, ...this.changePasswordGroup.value })
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
