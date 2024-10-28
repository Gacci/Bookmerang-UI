import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { forkJoin, takeUntil } from 'rxjs';

import { Unsubscribable } from '../../classes/unsubscribable';
import { AuthService } from '../../services/auth.service';
import { InstitutionService } from '../../services/institution.service';

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
  private readonly auth = inject(AuthService);
  private readonly service = inject(InstitutionService);

  protected institutions: any[] = [];
  protected isLoading!: boolean;

  value!: number; // Holds the selected institution ID
  onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    this.auth
      .getUserInstitutions()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((institutions: any[]) => (this.institutions = institutions));
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
    this.value = parseInt(target.value, 10);
    this.onChange(this.value);
    this.onTouched();
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
