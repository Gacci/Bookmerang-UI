import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbn13',
  standalone: true
})
export class ISBN13Pipe implements PipeTransform {
  transform(isbn13: string, ...args: unknown[]): string | null {
    return isbn13.replace(/(\d{3})(\d+)/, '$1-$2');
  }
}
