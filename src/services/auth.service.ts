import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, delay, map, of, switchMap, tap } from 'rxjs';
import { Data } from '@angular/router';

import { Credentials } from '../interfaces/credentials.interface';
import { EmailOnly } from '../interfaces/email-only.interface';
import { Registration } from '../interfaces/registration.interface';

import { CacheService } from './cache.service';

import * as JWT from 'jwt-decode';

const JWT_TOKEN = '__tcn';

type JwtPayloadPlus = JWT.JwtPayload & {
  institutions: number[];
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authTokenSubject = new BehaviorSubject<JwtPayloadPlus | null>(null);

  public $jwt = this.authTokenSubject.asObservable();

  private institutions: any[] = [];

  constructor(
    private readonly http: HttpClient,
    private cache: CacheService
  ) {
    if ( !this.authTokenSubject.value ) {
      this.authTokenSubject.next(
        this.getJwtTokenRaw()
          ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
          : null
      );
    }
  }

  register(payload: Registration) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: Credentials) {
    return this.http.post('http://127.0.0.1:3000/auth/login', payload)
      .pipe(
        tap((response: Data) => {
          this.storeJwtToken(response);
          this.authTokenSubject.next(
            this.getJwtTokenRaw()
              ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
              : null
          );
        }),
        switchMap((login) => 
          this.http.get(`http://127.0.0.1:3000/auth/institutions`)
            .pipe(
              tap((institutions) => this.institutions = <any[]>institutions),
              map(() => login)
            )
        )
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
          this.institutions = [];
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

  getUserInstitutions() {
    return this.http.get(`http://127.0.0.1:3000/auth/institutions`);
  }

  updatePrimaryInstitution(institutionId: number) {
    // this.primarySearchScope = primarySearchScope;
  }

  isAuthenticated() {
    return ((this.authTokenSubject?.value?.exp || 0) * 1000) > Date.now();
  }

  getUserId() {
    return this.authTokenSubject?.value?.sub
      ? +this.authTokenSubject.value.sub
      : 0;
  }

  getJwtTokenRaw() {
    return localStorage.getItem(JWT_TOKEN);
  }

  getJwtToken() {
    return <JwtPayloadPlus>this.authTokenSubject.value;
  }

  getPreferredSearchScope() {
  return this.institutions.find(() => true);
  }

  private storeJwtToken(token: any) {
    localStorage.setItem(JWT_TOKEN, token.access_token);
  }

  private removeJwtToken() {
    localStorage.removeItem(JWT_TOKEN);
  }
}
