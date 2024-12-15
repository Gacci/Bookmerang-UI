import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule
} from '@angular/router';
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
  imports: [CommonModule, NgxTippyModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent
  extends Unsubscribable
  implements OnInit, OnDestroy
{
  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  protected readonly auth = inject(AuthService);

  protected isRegisterOrLoginPage!: boolean;

  private lastHashedKeyword!: string;

  ngOnInit(): void {
    this.router.events
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        event =>
          (this.isRegisterOrLoginPage = /(sign-in|sign-up)/.test(
            this.router.url
          ))
      );
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
        scope: this.auth.getPrimaryScope(),
        isbn13: <string>json.isbn13
      });
      this.router
        .navigate(['books', 'markets'], {
          queryParams: {
            isbn13: <string>json.isbn13,
            scope: this.auth.getPrimaryScope()
          }
        })
        .then(() => (this.lastHashedKeyword = ''))
        .catch(() => (this.lastHashedKeyword = ''));
    } else {
      console.log('Searching by title or author');
      this.router
        .navigate(['books', 'collections'], {
          queryParams: {
            keyword: value,
            scope: this.auth.getPrimaryScope()
          }
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
