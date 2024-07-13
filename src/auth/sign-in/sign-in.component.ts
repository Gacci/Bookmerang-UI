import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { Credentials } from '../../interfaces/credentials.interface';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

import { signInGroup } from '../form-groups';
import { PasswordStrengthComponent } from '../../components/password-strength/password-strength.component';





@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PasswordStrengthComponent, SpinnerComponent],
  selector: 'sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  protected request: HttpRequest = {};

  protected signInGroup = signInGroup();

  constructor(private readonly auth: AuthService, 
              private readonly router: Router) {
                console.log(this.password.value)
              }

  handleSignIn() {
    this.request = { sent: true };
    this.auth.login(<Credentials>this.signInGroup.value).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.request.done = true;
      },
      complete: () => {
        this.request.done = true;
      },
    });
  }

  get email() {
    return this.signInGroup.controls.email;
  }

  get password() {
    return this.signInGroup.controls.password;
  }
}
