import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, map, of, tap } from 'rxjs';
import { Data } from '@angular/router';

import { Credentials } from '../interfaces/credentials.interface';
import { EmailOnly } from '../interfaces/email-only.interface';
import { Registration } from '../interfaces/registration.interface';

import { CacheService } from './cache.service';

import * as JWT from 'jwt-decode';

const JWT_TOKEN = '__tcn';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenSubject = new BehaviorSubject<any>(false);

  public $jwt = this.authTokenSubject.asObservable();

  private primarySearchScope!: number;

  constructor(
    private readonly http: HttpClient,
    private cache: CacheService
  ) {
    // this.jwtRawToken = this.getJwtTokenRaw();
    // this.jwtDecodedToken = this.getJwtToken();

    this.authTokenSubject.next(
      this.getJwtTokenRaw()
        ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
        : undefined
    );

    const { institutions } = this.getJwtToken();
    this.primarySearchScope = institutions?.length === 1 ? institutions[0] : 0;

    // console.log(this.jwtDecodedToken)
  }

  register(payload: Registration) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: Credentials) {
    return this.http.post('http://127.0.0.1:3000/auth/login', payload).pipe(
      tap((response: Data) => {
        this.storeJwtToken(response);
        this.authTokenSubject.next(
          this.getJwtTokenRaw()
            ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
            : undefined
        );
      })
    );
  }

  logout() {
    const token = this.getJwtTokenRaw();
    if (!token) {
      return of(true);
    }

    return this.revokeToken(token);
  }

  revokeToken(token: string) {
    return this.http
      .delete(`http://127.0.0.1:3000/auth/tokens/revoke`, { body: { token } })
      .pipe(
        tap(() => {
          this.removeJwtToken();
          this.authTokenSubject.next(null);
        })
      );
  }

  resendPasswordRecoveryCode(payload: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/auth/passwords/recovery/resend-request',
      payload
    );
  }

  startPasswordRecovery(payload: EmailOnly) {
    return this.http.post(
      'http://127.0.0.1:3000/auth/passwords/recovery/start',
      payload
    );
  }

  requestPasswordChange(payload: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/auth/passwords/recovery/reset',
      payload
    );
  }

  verifyPasswordRecoveryCode(payload: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/auth/passwords/recovery/verify',
      payload
    );
  }

  resendCreateAccountCode(payload: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/auth/accounts/verify/resend',
      payload
    );
  }
  verifyCreateAccountCode(payload: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/auth/accounts/verify',
      payload
    );
  }

  refreshAccessToken() {
    return this.http.post('', {});
  }

  isAuthenticated() {
    return 1000 * (this.authTokenSubject?.value?.exp || 0) > Date.now();
  }

  getUserId() {
    return this.authTokenSubject?.value?.sub;
  }

  getJwtTokenRaw() {
    return localStorage.getItem(JWT_TOKEN);
  }

  getJwtToken() {
    return this.authTokenSubject.value;
  }

  getPreferredSearchScope() {
    return this.primarySearchScope;
  }

  setPreferredSearchScope(primarySearchScope: number) {
    this.primarySearchScope = primarySearchScope;
  }

  private storeJwtToken(token: any) {
    localStorage.setItem(JWT_TOKEN, token.access_token);
  }

  private removeJwtToken() {
    localStorage.removeItem(JWT_TOKEN);
  }
}
