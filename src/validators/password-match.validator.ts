import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export const passwordMatchValidator = (
  password: string,
  confirmed: string,
): ValidatorFn => {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const pwdCtrl = formGroup.get(password);
    const confCtrl = formGroup.get(confirmed);
    if (!pwdCtrl || !confCtrl) {
      return null;
    }

    confCtrl.setErrors(
      pwdCtrl.value === confCtrl.value ? null : { passwordMismatch: true },
    );

    return confCtrl.getError('passwordMismatch');
  };
};
