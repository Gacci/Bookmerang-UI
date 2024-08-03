import { FormControl, FormGroup, Validators } from '@angular/forms';

export const email = [
  Validators.required,
  Validators.email,
  Validators.pattern(/^.+@([a-z]+\.)?[a-z]+\.[a-z]{2,3}$/),
];
export const token = [Validators.required, Validators.pattern(/[A-Z0-9]{6}/)];
export const password = [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) ];

export const startPasswordRecoveryGroup = () =>
  new FormGroup({
    email: new FormControl(null, email),
  });

export const verifyRequestTokenGroup = () =>
  new FormGroup({
    token: new FormControl(null, token),
  });

export const changePasswordGroup = () =>
  new FormGroup({
    password: new FormControl(null, password),
    confirmed: new FormControl(null, password),
    token: new FormControl(null, token),
    email: new FormControl(null, email),
  });

export const signInGroup = () =>
  new FormGroup({
    email: new FormControl(null, email),
    password: new FormControl(null, password),
    // remember: new FormControl(false, []),
  });

export const signUpGroup = () =>
  new FormGroup({
    email: new FormControl(null, email),
    password: new FormControl(null, password),
    confirmed: new FormControl(null, password),
    // agree: new FormControl(false, [Validators.required, Validators.requiredTrue]),
  });

export const verifyRegisterCodeGroup = () =>
  new FormGroup({
    token: new FormControl(null, token),
  });
