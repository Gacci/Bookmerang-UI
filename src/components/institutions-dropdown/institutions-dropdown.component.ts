import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { Unsubscribable } from '../../classes/unsubscribable';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'institutions-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './institutions-dropdown.component.html',
  styleUrl: './institutions-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InstitutionsDropdownComponent),
      multi: true
    }
  ]
})
export class InstitutionsDropdownComponent
  extends Unsubscribable
  implements OnInit, ControlValueAccessor
{
  @Input()
  value!: number;

  private readonly auth = inject(AuthService);

  protected institutions: any[] = [];
  protected isLoading!: boolean;

  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    this.institutions = this.auth.getAuthCampuses();
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Optional: Handle disabled state if needed
  }

  onSelectInstitution(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.value = +target.value;
    console.log(this.value);
    this.onChange(this.value);
    this.onTouched();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
