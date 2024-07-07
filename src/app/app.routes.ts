import { Routes } from '@angular/router';
// import { SigningComponent } from '../../src/components/signing/signing.component';

import { SignInComponent } from '../../src/components/sign-in/sign-in.component';
import { SignUpComponent } from '../../src/components/sign-up/sign-up.component';

import { PasswordRecoveryStartComponent } from '../../src/components/password-recovery-start/password-recovery-start.component';

export const routes: Routes = [{
    component: PasswordRecoveryStartComponent,
    path: 'password/recovery/start'    
}, {
    component: SignUpComponent,
    path: 'sign-up'
}, {
    component: SignInComponent,
    path: 'sign-in'   
},  { 
    path: '', 
    pathMatch: 'full',
    redirectTo: '/'
}];
