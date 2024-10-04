import { Component, Input } from '@angular/core';

@Component({
  selector: 'password-checker',
  standalone: true,
  imports: [],
  templateUrl: './password-checker.component.html',
  styleUrls: ['./password-checker.component.scss']
})
export class PasswordCheckerComponent {
  @Input()
  set input(value: string | null | undefined) {
    this.validatePassword(value ?? '');
  }

  protected minEightChars!: boolean;
  protected oneDigitChar!: boolean;
  protected oneLowerCase!: boolean;
  protected oneSpecialChar!: boolean;
  protected oneUpperCase!: boolean;

  private validatePassword(value: string = '') {
    const chars = Array.from({ length: value?.length }).map((v, i) =>
      value.charCodeAt(i)
    );

    this.minEightChars = chars.length >= 8;
    this.oneLowerCase = !!~chars.findIndex((ch: number) => ch >= 97 && ch <= 122);
    this.oneUpperCase = !!~chars.findIndex((ch: number) => ch >= 65 && ch <= 90);
    this.oneDigitChar = !!~chars.findIndex((ch: number) => ch >= 48 && ch <= 57);
    this.oneSpecialChar = !!~chars.findIndex(
      (ch: number) =>
        (ch >= 33 && ch <= 47) || // Special characters in range !"#$%&'()*+,-./
        (ch >= 58 && ch <= 64) || // Special characters in range :;<=>?@
        (ch >= 91 && ch <= 96) || // Special characters in range [\]^_`
        (ch >= 123 && ch <= 126) // Special characters in range {|}~
    );
  }
}
