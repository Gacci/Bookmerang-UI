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

import { AuthCredentials } from '../interfaces/auth-credentials.interface';
import { Email } from '../interfaces/email.interface';
import { Institution } from '../interfaces/institution.interface';
import { PasswordCredentials } from '../interfaces/password-credentials.interface';
import { User } from '../interfaces/user';

import * as JWT from 'jwt-decode';
import { AuthAcademics } from '../interfaces/auth-academics.interface';

type JwtPayloadPlus = JWT.JwtPayload & { scope?: number };

const JWT_TOKEN = '__tcn';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private institution!: Institution;

  private authTokenSubject = new BehaviorSubject<JwtPayloadPlus | null>(null);

  private userProfileSubject = new BehaviorSubject<User | null>(null);

  public $jwt = this.authTokenSubject.asObservable();

  public $user = this.userProfileSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  async init() {
    if (!this.authTokenSubject.value) {
      this.authTokenSubject.next(
        this.getJwtTokenRaw()
          ? JWT.jwtDecode(this.getJwtTokenRaw() ?? '')
          : null
      );
    }

    if (this.isAuthenticated()) {
      this.institution = await firstValueFrom(this.fetchAuthInstitution());
      this.userProfileSubject.next(
        await firstValueFrom(this.fetchAuthProfile())
      );
    }

    console.log('JWT: ', this.authTokenSubject.value);
  }

  /**************************************** AUTHENTICATION ***************************************/
  register(payload: AuthCredentials & PasswordCredentials) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }

  login(payload: AuthCredentials) {
    return this.http.post('http://127.0.0.1:3000/auth/login', payload).pipe(
      tap((login: any) => {
        localStorage.setItem(JWT_TOKEN, login.access_token);
        this.authTokenSubject.next(
          <JWT.JwtPayload>JWT.jwtDecode(login.access_token)
        );
      }),
      switchMap(login =>
        combineLatest([
          this.fetchAuthProfile(),
          this.fetchAuthInstitution()
        ]).pipe(
          tap(([user, institution]: [User, Institution]) => {
            this.institution = institution;
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

  startPasswordRecovery(payload: Email) {
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
    return this.http.put('http://127.0.0.1:3000/auth/profile', update);
  }

  updateAuthPassword(update: PasswordCredentials) {
    return this.http.put('http://127.0.0.1:3000/auth/password', update);
  }

  updateAuthAcademics(update: Partial<AuthAcademics>) {
    return this.http.put('http://127.0.0.1:3000/auth/academics', update);
  }

  fetchAuthProfile() {
    return this.http.get<User>('http://127.0.0.1:3000/auth').pipe(
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
  fetchAuthInstitution() {
    return this.http.get<Institution>('http://127.0.0.1:3000/auth/institution');
  }

  /*************************************** LOCAL METHODS *****************************************/
  getAuthScope() {
    return this.institution;
  }

  getAuthProfile() {
    return <User>this.userProfileSubject.value;
  }

  getAuthScopeId() {
    return this.authTokenSubject.value?.scope;
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
    return <JwtPayloadPlus>this.authTokenSubject.value;
  }
}
