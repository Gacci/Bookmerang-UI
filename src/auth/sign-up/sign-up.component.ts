import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { passwordMatchValidator } from '../../validators/password-match.validator';

import { signUpGroup } from '../form-groups';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  protected request: HttpRequest = {};

  protected signUpGroup = signUpGroup();

  constructor(private readonly auth: AuthService) {
    this.signUpGroup.addValidators(passwordMatchValidator('password', 'confirmed'))
  }

  handleSignUp() {
    this.request = { sent: true };
    this.auth.register(this.signUpGroup.value)
      .subscribe({
        next: (response) => {
          console.log(response)
        },
        error: (e) => {
          this.request.done = true;
        },
        complete: () => {
          this.request.done = true;
        }
      });
  }
}
