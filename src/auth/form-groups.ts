import { FormControl, FormGroup, Validators } from '@angular/forms';

export const email = [
  Validators.required,
  Validators.email,
  Validators.pattern(/^.+@([a-z]+\.)?[a-z]+\.[a-z]{2,3}$/)
];
export const token = [Validators.required, Validators.pattern(/[A-Z0-9]{6}/)];
export const password = [
  Validators.required /*, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)*/
];

export const startPasswordRecoveryGroup = () =>
  new FormGroup({
    email: new FormControl(null, email)
  });

export const verifyRequestTokenGroup = () =>
  new FormGroup({
    token: new FormControl('', token)
  });

export const changePasswordGroup = () =>
  new FormGroup({
    password: new FormControl('', password),
    confirmed: new FormControl('', password),
    token: new FormControl('', token),
    email: new FormControl('', email)
  });

export const signInGroup = () =>
  new FormGroup({
    email: new FormControl('', email),
    password: new FormControl('', password)
    // remember: new FormControl(false, []),
  });

export const signUpGroup = () =>
  new FormGroup({
    email: new FormControl('', email),
    password: new FormControl('', password),
    confirmed: new FormControl('', password)
    // agree: new FormControl(false, [Validators.required, Validators.requiredTrue]),
  });

export const verifyRegisterCodeGroup = () =>
  new FormGroup({
    token: new FormControl('', token)
  });
