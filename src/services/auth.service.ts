import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { Data } from '@angular/router';

import { Credentials } from '../interfaces/credentials.interface';
import { EmailOnly } from '../interfaces/email-only.interface';
import { Registration } from '../interfaces/registration.interface';

import { CacheService } from './cache.service';

import * as JWT from 'jwt-decode';
import { Institution } from '../interfaces/institution.interface';

const JWT_TOKEN = '__tcn';

type UserRefInstitutions = {
  userId: number;
  institutionId: number;
  primary: boolean;
};

type JwtPayloadPlus = JWT.JwtPayload & {
  scope: number[];
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private institutions: Institution[] = [];

  private authTokenSubject = new BehaviorSubject<JwtPayloadPlus | null>(null);

  public $jwt = this.authTokenSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private cache: CacheService
  ) {}

  async init() {
    console.log('Auth.init');

    if (!this.authTokenSubject.value) {
      this.authTokenSubject.next(
        this.getJwtTokenRaw()
          ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
          : null
      );
    }

    if (this.authTokenSubject.value) {
      this.institutions = !!this.authTokenSubject.value?.scope?.length
        ? await firstValueFrom(this.loadUserInstitutions())
        : this.institutions;
    }

    console.log('Auth.institutions', this.institutions);
  }

  register(payload: Registration) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: Credentials) {
    return this.http.post('http://127.0.0.1:3000/auth/login', payload).pipe(
      tap((login: any) => {
        localStorage.setItem(JWT_TOKEN, login.access_token);
        this.authTokenSubject.next(
          <JwtPayloadPlus>JWT.jwtDecode(login.access_token)
        );
      }),
      switchMap(login =>
        this.loadUserInstitutions().pipe(
          tap(institutions => (this.institutions = institutions)),
          map(() => this.authTokenSubject.value)
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
          this.authTokenSubject.next(null);
          localStorage.removeItem(JWT_TOKEN);
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

  loadUserInstitutions() {
    return this.http.get<Institution[]>(
      'http://127.0.0.1:3000/auth/institutions'
    );
  }

  isAuthenticated() {
    return this.authTokenSubject?.value?.exp
      ? this.authTokenSubject.value.exp * 1000 > Date.now()
      : false;
  }

  getUserCampuses() {
    return !!this.authTokenSubject?.value?.scope?.length
      ? this.institutions
      : [];
  }

  getUserScope() {
    console.log(this.authTokenSubject?.value?.scope);
    return this.authTokenSubject?.value?.scope;
  }

  getUserId() {
    return this.authTokenSubject?.value?.sub
      ? +this.authTokenSubject.value.sub
      : 0;
  }

  getPrimaryScope() {
    return !!this.authTokenSubject?.value?.scope?.length
      ? +this.authTokenSubject.value.scope?.[0]
      : 0;
  }

  getJwtTokenRaw() {
    return localStorage.getItem(JWT_TOKEN);
  }

  getJwtToken() {
    return <JwtPayloadPlus>this.authTokenSubject.value;
  }
}
