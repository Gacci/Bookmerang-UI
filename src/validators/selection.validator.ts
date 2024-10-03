import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function selectionValidator(opts: {
  in?: Array<number | string>;
  not?: Array<number | string>;
}): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (opts.in?.includes(control.value)) {
      return null;
    }

    if (!opts.not?.includes(control.value)) {
      return null;
    }

    return { invalidSelection: true };
  };
}
