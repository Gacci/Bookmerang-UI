import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';

import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { AuthService } from '../../services/auth.service';

import { DropdownDirective } from '../../directives/dropdown.directive';

import { Unsubscribable } from '../../classes/unsubscribable';

import * as Hash from 'crypto-hash';
import * as ISBN from 'isbn3';

type SearchEvent = {
  type: 'isbn' | 'keyword';
  value: string;
};

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, DropdownDirective, NgxTippyModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent
  extends Unsubscribable
  implements OnInit, OnDestroy
{
  private router = inject(Router);

  protected auth = inject(AuthService);

  private lastHashedKeyword!: string;

  protected scope!: number;

  ngOnInit(): void {
    // this.isAuthenticated = this.auth.isAuthenticated();

    this.auth.$user
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => (this.scope = this.auth.getPrimaryScope()));
  }

  async handleEnterKeyUp(e: Event) {
    const input = <HTMLInputElement>e.target;
    const value = input.value?.replace(/^\s+|\-+|\s+$/, '');

    if (!value) {
      return;
    }

    const newHashedKeyword = await Hash.sha256(value);
    if (this.lastHashedKeyword === newHashedKeyword) {
      return;
    }

    this.lastHashedKeyword = newHashedKeyword;
    const json =
      value.length === 10 || value.length === 13
        ? ISBN.parse(value)
        : undefined;

    if (json?.isValid) {
      console.log('Searching by isbn', {
        scope: this.scope,
        isbn13: <string>json.isbn13
      });
      this.router
        .navigate(['books', 'markets'], {
          queryParams: { scope: this.scope, isbn13: <string>json.isbn13 }
        })
        .then(() => (this.lastHashedKeyword = ''))
        .catch(() => (this.lastHashedKeyword = ''));
    } else {
      console.log('Searching by title or author');
      this.router
        .navigate(['books', 'collections'], {
          queryParams: { scope: this.scope, keyword: value }
        })
        .then(() => (this.lastHashedKeyword = ''))
        .catch(() => (this.lastHashedKeyword = ''));
    }
  }

  handleSignOut() {
    this.auth
      .logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(response => {
        this.router.navigateByUrl('/sign-in');
      });
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
