import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';

import { Credentials } from '../../interfaces/credentials.interface';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

import { signInGroup } from '../form-groups';
// import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';
import { Unsubscribable } from '../../classes/unsubscribable';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // PasswordStrengthComponent,
    SpinnerComponent
  ],
  selector: 'sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent extends Unsubscribable {
  private readonly auth = inject(AuthService);

  private readonly router = inject(Router);

  protected request: HttpRequest = {};

  protected signInGroup = signInGroup();

  handleSignIn() {
    this.request = { sent: true };
    this.auth
      .login(<Credentials>this.signInGroup.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: async jwt => {
          if (this.auth.isAuthenticated() && this.auth.getPrimaryScope()) {
            this.router.navigateByUrl('home');
          } else {
            this.router.navigateByUrl('settings');
          }
        },
        error: () => (this.request.done = true),
        complete: () => (this.request.done = true)
      });
  }

  get email() {
    return this.signInGroup.controls.email;
  }

  get password() {
    return this.signInGroup.controls.password;
  }
}
