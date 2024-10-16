import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, of, tap } from 'rxjs';
import { Data } from '@angular/router';

import { Credentials } from '../interfaces/credentials.interface';
import { EmailOnly } from '../interfaces/email-only.interface';
import { Registration } from '../interfaces/registration.interface';

import { CacheService } from './cache.service';

import * as JWT from 'jwt-decode';

const JWT_TOKEN = '__tcn';

const jwt = '';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private cache: CacheService
  ) {
    console.log(this.getJwtToken());
  }

  register(payload: Registration) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: Credentials) {
    return this.http
      .post('http://127.0.0.1:3000/auth/login', payload)
      .pipe(tap((response: Data) => this.storeJwtTokens(response)));
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
      .delete(`http://127.0.0.1:3000/auth/tokens/revoke/${token}`)
      .pipe(tap(() => this.removeJwtToken()));
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
    return this.http.post('http://127.0.0.1:3000/auth/accounts/verify', payload);
  }

  refreshAccessToken() {
    return this.http.post('', {});
  }

  getJwtToken() {
    const token = this.getJwtTokenRaw();
    if (!token) {
      return null;
    }

    return <JWT.JwtPayload & { institutions: Array<number> }>JWT.jwtDecode(token);
  }

  getJwtTokenRaw() {
    return jwt; //localStorage.getItem(JWT_TOKEN);
  }

  getMarketScope() {
    const jwt = this.getJwtToken();
    if (!jwt) {
      return [];
    }

    return jwt.institutions;
  }

  private storeJwtTokens(token: Data) {
    localStorage.setItem(JWT_TOKEN, JSON.stringify(token));
  }

  private removeJwtToken() {
    localStorage.removeItem(JWT_TOKEN);
  }
}
