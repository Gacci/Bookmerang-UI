import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { takeUntil } from 'rxjs';

import { AcademicProgramService } from '../services/academic-program.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import { Unsubscribable } from '../classes/unsubscribable';

@Component({
  selector: 'profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends Unsubscribable implements OnInit {
  protected auth = inject(AuthService);

  protected users = inject(UserService);

  protected programs = inject(AcademicProgramService);

  protected academicProgramsList: any[] = [];

  protected form = new FormGroup({
    personal: new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]),
      alternativeEmail: new FormControl('', [Validators.email]),
      gender: new FormControl(null, [Validators.required]),
      bio: new FormControl(null, [])
    }),
    security: new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmed: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      oldPassword: new FormControl('', [Validators.required])
    }),
    academic: new FormGroup({
      campus: new FormControl<number>(0, [Validators.required]),
      major: new FormControl<number>(0, Validators.required)
    })
  });

  protected user: any = {
    profilePictureUrl: 'https://via.placeholder.com/100'
  };

  ngOnInit(): void {
    this.users
      .profile(this.auth.getUserId())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (user: any) => {
          const { academic, ...personal } = user;
          this.user = user;
          this.form.patchValue({
            personal,
            academic
          });
        }
      });

    this.programs
      .dump()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (programs: any[]) => {
          this.academicProgramsList = [
            { name: 'Select your major/minor', academicProgramId: 0 }
          ].concat(programs);
        }
      });
  }

  onSubmit(): void {
    console.log(this.form.value);
    if (this.form.valid) {
      console.log('Form Submitted');
    } else {
      console.log('Form Invalid');
    }
  }

  onInputChange(e: Event) {
    const target = <HTMLInputElement>e.target;
    if (!target.files) {
      return;
    }

    const reader = new FileReader();
    reader.onload = e =>
      (this.user.profilePictureUrl = <string>e.target?.result);

    reader.readAsDataURL(<File>target.files.item(0));
  }

  get password() {
    return this.form.controls.security.controls.password;
  }

  get confirmed() {
    return this.form.controls.security.controls.confirmed;
  }
}
