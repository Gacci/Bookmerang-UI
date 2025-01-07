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
import { InstitutionService } from '../services/institution.service';
import { Institution } from '../interfaces/institution.interface';

// import * as Hash from 'crypto-hash';
import { User } from '../interfaces/user';
import { passwordMatchValidator } from '../validators/password-match.validator';

@Component({
  selector: 'profile-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends Unsubscribable implements OnInit {
  protected auth = inject(AuthService);

  protected instServ = inject(InstitutionService);

  protected programs = inject(AcademicProgramService);

  protected academicProgramsList: any[] = [];

  protected user!: User;

  protected institutions: Institution[] = [];

  protected hasScopeSet!: boolean;

  protected academicHashedValue!: string;

  protected personalHashedValue!: string;

  protected securityHashedValue!: string;

  protected information = new FormGroup({
    alternativeEmail: new FormControl<string | null>(null, [Validators.email]),
    firstName: new FormControl<string | null>(null, [
      Validators.minLength(2),
      Validators.pattern(/^[A-Z]+$/i)
    ]),
    gender: new FormControl<string | null>(null, []),
    lastName: new FormControl<string | null>(null, [
      Validators.minLength(2),
      Validators.pattern(/^[A-Z\-]+$/i)
    ]),
    mobile: new FormControl<string | null>(null, [
      Validators.pattern(/^(\+1|1)?[0-9]{10}$/)
    ]),

    confirmed: new FormControl<string | null>(null, [
      passwordMatchValidator('password', 'confirmed')
    ]),
    oldPassword: new FormControl(null, []),
    password: new FormControl<string | null>(null, [
      passwordMatchValidator('password', 'confirmed')
    ])
  });

  protected academics = new FormGroup({
    major: new FormControl<number | null>(null, []),
    scope: new FormControl<number | null>(null, [Validators.required]),
    isPrimary: new FormControl<boolean | null>(null)
  });

  ngOnInit(): void {
    this.hasScopeSet = !!this.auth.getAuthScopeId();
    this.user = this.auth.getAuthProfile();
    this.information.patchValue(this.user);

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

    const user = this.auth.getAuthProfile();
    this.instServ
      .search({
        website: user.email.replace(/^.+@/gi, '').split('.').slice(-2).join('.')
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ data }) => {
        this.institutions = data;
        this.academics.patchValue({
          scope: this.auth.getAuthScopeId()
        });
      });
  }

  onBasicInfoSubmit(): void {
    this.information.markAllAsTouched();
    console.log(this.information.invalid);

    if (this.information.invalid) {
      return;
    }

    this.auth
      .updateAuthProfile(<Partial<User>>{
        ...this.information.value,
        ...(this.information.value?.password
          ? { password: this.information.value?.password }
          : {})
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {});
  }

  onAcademicInfoSubmit() {
    this.academics.markAllAsTouched();
    console.log(this.academics.invalid);

    if (this.academics.invalid) {
      return;
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
}
