import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IResult, PasswordMeter } from 'password-meter';

// import * as PasswordMeter from 'password-meter';

@Component({
  selector: 'password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.scss',
})
export class PasswordStrengthComponent {
  private checker!: PasswordMeter;

  protected result!: IResult;

  protected highlight!: string;

  @Input()
  set password(value: string | null) {
    this.result = this.checker.getResult(value ?? '');
    this.highlight =
      this.result.percent > 0 && this.result.percent <= 20
        ? 'bg-red-300'
        : this.result.percent > 20 && this.result.percent <= 40
          ? 'bg-orange-300'
          : this.result.percent > 40 && this.result.percent <= 60
            ? 'bg-yellow-300'
            : this.result.percent > 60 && this.result.percent <= 80
              ? 'bg-green-300'
              : this.result.percent > 80
                ? 'bg-green-500'
                : '';

    console.log(this.highlight);
  }

  constructor() {
    this.checker = new PasswordMeter();
    console.log(this.checker.getResult('Jonathan'));
  }
}
