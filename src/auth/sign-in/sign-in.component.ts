import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  protected request: HttpRequest = {};

  protected signInGroup = new FormGroup({
    email: new FormControl(null, [ Validators.required, Validators.email, Validators.pattern(/^.+@([a-z]+\.)?[a-z]+\.[a-z]{2,3}$/) ]),
    password: new FormControl(null, [ Validators.required ]),
    remember: new FormControl(false, [ ])
  });

  constructor(private readonly http: HttpClient) {}

  handleSignIn() {
    this.request = { sent: true };
    this.http.post('http://127.0.0.1:3000/auth/login', this.signInGroup.value)
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
