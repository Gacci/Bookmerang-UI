import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpRequest } from '../../interfaces/http-request.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { passwordMatchValidator } from '../../validators/password-match.validator';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  protected request: HttpRequest = {};

  protected signUpGroup = new FormGroup({
    email: new FormControl(null, [ Validators.required, Validators.email, Validators.pattern(/^.+@([a-z]+\.)?[a-z]+\.[a-z]{2,3}$/) ]),
    password: new FormControl(null, [ Validators.required ]),
    confirmed: new FormControl(null, [ Validators.required ]),
    agree: new FormControl(false, [ Validators.required, Validators.requiredTrue ])
  });

  constructor(private readonly http: HttpClient) {
    this.signUpGroup.addValidators(passwordMatchValidator('password', 'confirmed'))
  }

  handleSignUp() {
    this.request = { sent: true };
    this.http.post('http://127.0.0.1:3000/auth/register', this.signUpGroup.value)
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
