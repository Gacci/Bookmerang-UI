import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { HttpRequest } from '../../interfaces/http-request.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

import { signInGroup } from '../form-groups';


@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  protected request: HttpRequest = {};

  protected signInGroup = signInGroup();

  constructor(private readonly auth: AuthService) {}

  handleSignIn() {
    this.request = { sent: true };
    this.auth.login(this.signInGroup.value)
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
