import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import * as ISBN from 'isbn3';

type SearchEvent = {
  type: 'isbn' | 'keyword';
  value: string;
};

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(private router: Router) {
    console.log('NavigationComponent');
  }

  handleEnterKeyUp(e: Event) {
    const input = <HTMLInputElement>e.target;
    const value = input.value?.replace(/^\s+|\s+$/, '');

    if (!value) {
      return;
    }

    const json =
      value.length === 10 || value.length === 13 ? ISBN.parse(value) : undefined;

    if (json?.isValid) {
      this.router.navigate(['books', 'markets'], {
        queryParams: { isbn13: <string>json.isbn13 }
      });
    } else {
      this.router.navigate(['books', 'collections'], {
        queryParams: { title: value }
      });
    }
  }
}
