import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { finalize, of, switchMap, takeUntil } from 'rxjs';

import { NgxTippyModule } from 'ngx-tippy-wrapper';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

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

  private auth = inject(AuthService);

  private users = inject(UserService);

  private lastHashedKeyword!: string;

  protected isLoadingUser!: boolean;

  protected isAuthenticated!: boolean;

  protected user!: any;

  protected scope = this.auth.getPrimaryScope();

  ngOnInit(): void {
    this.isLoadingUser = true;
    this.auth.$jwt
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((token: any) => {
          this.isAuthenticated = !!token?.sub;
          if (this.isAuthenticated) {
            return this.users.profile(this.auth.getUserId());
          } else {
            return of(null); // Handle unauthenticated state
          }
        }),
        finalize(() => {
          this.isLoadingUser = false;
        })
      )
      .subscribe({
        next: (user: any) => {
          this.user = user;
          this.isLoadingUser = false;
        },
        error: err => {
          this.isLoadingUser = false;
        }
      });
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
      console.log('Searching by isbn');
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
