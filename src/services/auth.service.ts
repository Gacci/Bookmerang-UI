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

const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnN0aXR1dGlvbnMiOls1LDU2XSwiZW1haWwiOiJjYW1lcm9uLm5vbGFuQGlzdGMuZWR1IiwiaWF0IjoxNzI5MTM2MDE3LCJpc3MiOiJodHRwOi8vYm9va21lcmFuZy5jb20iLCJqdGkiOiIzMzE3MjI4RkYyODlCQUFDNEExNTRGQ0FGOTZGRDg1NiIsInJvbGVzIjpbXSwic3ViIjo2NSwiZXhwIjoxNzI5Mzk1MjE3fQ.slFz2OmMzFLxy0j8KLnw7BJC284lueN9xrfME3jijAA';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenSubject = new BehaviorSubject<any>(false);
  public $jwt = this.authTokenSubject.asObservable();

  // private jwtRawToken!: string | null;

  // private jwtDecodedToken: any | null;

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

  getMarketScope() {
    return this.authTokenSubject?.value?.institutions;
  }

  getJwtTokenRaw() {
    return localStorage.getItem(JWT_TOKEN);
  }

  getJwtToken() {
    // <JWT.JwtPayload & { institutions: Array<number> }>
    return this.authTokenSubject.value;
  }

  private storeJwtToken(token: any) {
    localStorage.setItem(JWT_TOKEN, token.access_token);
  }

  private removeJwtToken() {
    localStorage.removeItem(JWT_TOKEN);
  }
}
