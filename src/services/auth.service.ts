import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Data } from '@angular/router';

import { Credentials } from '../interfaces/credentials.interface';
import { EmailOnly } from '../interfaces/email-only.interface';
import { Registration } from '../interfaces/registration.interface';


const JWT_TOKENS = '__tcn';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  register(payload: Registration) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: Credentials) {
    return this.http
      .post('http://127.0.0.1:3000/auth/login', payload)
      .pipe(
        tap((response: Data) => this.storeJwtTokens(response))
      );
  }

  logout() {
    return this.revokeTokens(this.getJwtTokens());
  }

  revokeTokens(payload: Data) {
    return this.http.post('http://127.0.0.1:3000/auth/tokens/revoke', payload)
      .pipe(
        tap(() => this.removeJwtTokens())
      );
  }

  resendPasswordRecoveryCode(payload: Data) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/resend-request', payload);
  }

  startPasswordRecovery(payload: EmailOnly) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/start', payload);
  }

  requestPasswordChange(payload: Data) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/reset', payload);
  }

  verifyPasswordRecoveryCode(payload: Data) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/verify', payload);
  }

  resendCreateAccountCode(payload: Data) {
    return this.http.post('http://127.0.0.1:3000/auth/accounts/verify/resend', payload);
  }
  verifyCreateAccountCode(payload: Data) {
    return this.http.post('http://127.0.0.1:3000/auth/accounts/verify', payload);
  }

  getJwtTokens() {
    const tokens = localStorage.getItem(JWT_TOKENS);
    if (!tokens) {
      return null;
    }

    try {
      return JSON.parse(tokens);
    } catch (e) {
      return null;
    }
  }

  refreshAccessToken() {
    return this.http.post('', {});
  }

  private storeJwtTokens(tokens: Data) {
    localStorage.setItem(JWT_TOKENS, JSON.stringify(tokens));
  }

  private removeJwtTokens() {
    localStorage.removeItem(JWT_TOKENS);
  }
}
