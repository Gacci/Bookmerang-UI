import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { finalize, takeUntil } from 'rxjs';

import { AcademicProgramService } from '../services/academic-program.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import { Unsubscribable } from '../classes/unsubscribable';
import { InstitutionService } from '../services/institution.service';
import { Institution } from '../interfaces/institution.interface';

// import * as Hash from 'crypto-hash';
import { User } from '../interfaces/user';
import { passwordMatchValidator } from '../validators/password-match.validator';
import { PasswordCredentials } from '../interfaces/password-credentials.interface';

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
    alternativeEmail: new FormControl<string>('', [Validators.email]),
    firstName: new FormControl<string>('', [
      Validators.minLength(2),
      Validators.pattern(/^[A-Z]+$/i)
    ]),
    gender: new FormControl<string>('', []),
    lastName: new FormControl<string>('', [
      Validators.minLength(2),
      Validators.pattern(/^[A-Z\-]+$/i)
    ]),
    mobile: new FormControl<string>('', [
      Validators.pattern(/^(\+1|1)?[0-9]{10}$/)
    ])
  });

  protected security = new FormGroup({
    confirmed: new FormControl<string>('', [
      passwordMatchValidator('password', 'confirmed')
    ]),
    oldPassword: new FormControl(null, []),
    password: new FormControl<string>('', [
      passwordMatchValidator('password', 'confirmed')
    ])
  });

  protected academics = new FormGroup({
    majorId: new FormControl<number>(0, []),
    minorId: new FormControl<number>(0, []),
    institutionId: new FormControl<number>(0, [Validators.required, Validators.min(1)])
  });

  ngOnInit(): void {
    this.hasScopeSet = !!this.auth.getAuthScopeId();
    this.user = this.auth.getAuthProfile();
    this.information.patchValue(this.user);

    this.programs
      .dump()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((programs: any[]) => this.academicProgramsList = programs);

    const user = this.auth.getAuthProfile();
    this.instServ
      .search({
        website: user.email.replace(/^.+@/gi, '').split('.').slice(-2).join('.')
      })
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {

        })
      )
      .subscribe(({ data }) => {
        this.institutions = data;
        this.academics.patchValue({
          institutionId: this.auth.getAuthScopeId()
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
      .updateAuthProfile(<Partial<User>>this.information.value)
      .pipe(
        takeUntil(this.unsubscribe$),
        finalize(() => {

        })
      )
      .subscribe(response => {});
  }

  onSecurityInfoSubmit() {
    if (this.security.invalid) {
      return;
    }

    // this.auth.updateAuthPassword(this.security.value)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     finalize(() => {

    //     })
    //   )
    //   .subscribe(response => {});

  }

  onAcademicInfoSubmit() {
    console.log(this.academics.invalid);

    if (this.academics.invalid) {
      return;
    }

    // this.auth.updateAuthAcademics(this.academics.value)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     finalize(() => {

    //     })
    //   )
    //   .subscribe(response => {});

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
