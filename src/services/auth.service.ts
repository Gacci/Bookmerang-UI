import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';
import { Data } from '@angular/router';

import { Credentials } from '../interfaces/credentials.interface';
import { EmailOnly } from '../interfaces/email-only.interface';
import { Registration } from '../interfaces/registration.interface';
import { Scope } from '../interfaces/scope.interface';
import { User } from '../interfaces/user';

import * as JWT from 'jwt-decode';

const JWT_TOKEN = '__tcn';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private scoping: Scope[] = [];

  private authTokenSubject = new BehaviorSubject<JWT.JwtPayload | null>(null);

  private userProfileSubject = new BehaviorSubject<User | null>(null);

  public $jwt = this.authTokenSubject.asObservable();

  public $user = this.userProfileSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  async init() {
    console.log('Auth.init');

    if (!this.authTokenSubject.value) {
      this.authTokenSubject.next(
        this.getJwtTokenRaw()
          ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
          : null
      );
    }

    if (this.isAuthenticated()) {
      this.scoping = await firstValueFrom(this.fetchAuthScope());
      this.userProfileSubject.next(
        await firstValueFrom(this.fetchAuthProfile())
      );
    }

    console.log(
      'Auth.institutions',
      '\nisAuthenticated: ',
      this.isAuthenticated(),
      '\nscoping: ',
      this.scoping,
      '\nuser: ',
      this.userProfileSubject.value,
      '\nauth: ',
      this.authTokenSubject.value,
      '\ndocument.cookie',
      document.cookie
    );
  }

  /**************************************** AUTHENTICATION ***************************************/
  register(payload: Registration) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: Credentials) {
    return this.http.post('http://127.0.0.1:3000/auth/login', payload).pipe(
      tap((login: any) => {
        localStorage.setItem(JWT_TOKEN, login.access_token);
        this.authTokenSubject.next(
          <JWT.JwtPayload>JWT.jwtDecode(login.access_token)
        );
      }),
      switchMap(login =>
        combineLatest([this.fetchAuthProfile(), this.fetchAuthScope()]).pipe(
          tap(([user, scoping]: [User, Scope[]]) => {
            console.log('Auth.user', user, '\nScope: ', scoping);
            this.scoping = scoping;
            this.userProfileSubject.next(user);
          }),
          map(() => this.authTokenSubject.value)
        )
      )
    );
  }

  logout() {
    const token = this.getJwtTokenRaw();
    if (!token) {
      return of(true).pipe(
        tap(() => {
          console.log('logout.of(true)');
          this.authTokenSubject.next(null);
          this.userProfileSubject.next(null);
        })
      );
    }

    return this.revokeToken(token).pipe(
      tap(() => {
        localStorage.removeItem(JWT_TOKEN);
        this.authTokenSubject.next(null);
        this.userProfileSubject.next(null);
      })
    );
  }

  refreshAccessToken() {
    return this.http.post(`http://127.0.0.1:3000/auth/tokens`, {});
  }

  revokeToken(token: string) {
    return this.http.delete(`http://127.0.0.1:3000/auth/tokens`, {
      body: { token }
    });
  }

  /************************************** PASSWORD RECOVERY **************************************/
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

  /******************************************* PROFILE *******************************************/
  updateAuthProfile(update: Partial<User>) {
    return this.http.put(
      `http://127.0.0.1:3000/auth/${this.getAuthId()}`,
      update
    );
  }

  fetchAuthProfile() {
    return this.http
      .get<User>(`http://127.0.0.1:3000/auth/${this.getAuthId()}`)
      .pipe(
        map((user: User) => ({
          ...user,
          ...(!user.profilePictureUrl
            ? {
                profilePictureUrl: './assets/images/user-image-unavailable.png'
              }
            : {})
        }))
      );
  }

  /******************************************* SCOPING *******************************************/
  addAuthInstitution(data: any) {
    return this.http.post('http://127.0.0.1:3000/auth/scoping', data);
  }

  fetchAuthScope() {
    return this.http.get<Scope[]>('http://127.0.0.1:3000/auth/scoping');
  }

  updateAuthInstitutions(id: number, data: any) {
    return this.http.post(`http://127.0.0.1:3000/auth/scoping/${id}`, data);
  }

  deleteAuthInstitution(id: number) {
    return this.http.delete(`http://127.0.0.1:3000/auth/scoping/${id}`);
  }

  /*************************************** LOCAL METHODS *****************************************/
  getAuthCampuses() {
    return this.scoping ?? [];
  }

  getAuthScope() {
    return this.scoping.map((e: Scope) => e.institutionId);
  }

  getPrimaryScope() {
    return this.scoping?.find((e: Scope) => e.isPrimary)?.institutionId ?? 0;
  }

  getAuthProfile() {
    return <User>this.userProfileSubject.value;
  }

  getAuthId() {
    return this.authTokenSubject?.value?.sub
      ? +this.authTokenSubject.value.sub
      : 0;
  }

  isAuthenticated() {
    return this.authTokenSubject?.value?.exp
      ? this.authTokenSubject.value.exp * 1000 > Date.now()
      : false;
  }

  getJwtTokenRaw() {
    return localStorage.getItem(JWT_TOKEN);
  }

  getJwtToken() {
    return <JWT.JwtPayload>this.authTokenSubject.value;
  }
}
