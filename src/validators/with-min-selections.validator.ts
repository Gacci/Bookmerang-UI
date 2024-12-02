import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function withMinSelections(count: number = 1): ValidatorFn {
  return (array: AbstractControl): ValidationErrors | null => {
    return array.value.reduce(
      (sum: number, checked: boolean) => (sum += checked ? 1 : 0),
      0
    ) < count
      ? { withMinSelections: true }
      : null;
  };
}
