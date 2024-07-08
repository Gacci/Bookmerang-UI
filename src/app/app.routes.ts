import { Routes } from '@angular/router';
// import { SigningComponent } from '../../src/components/signing/signing.component';

import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';

import { PasswordRecoveryStartComponent } from '../auth/password-recovery-start/password-recovery-start.component';

export const routes: Routes = [
  {
    component: PasswordRecoveryStartComponent,
    path: 'password/recovery/start',
  },
  {
    component: SignUpComponent,
    path: 'sign-up',
  },
  {
    component: SignInComponent,
    path: 'sign-in',
  },
  {
    path: '*',
    pathMatch: 'full',
    redirectTo: '/',
  },
];
