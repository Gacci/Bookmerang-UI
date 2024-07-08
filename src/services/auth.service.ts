import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

const JWT_TOKENS = '__tcn';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }


  register(payload: any) {
    return this.http.post('http://127.0.0.1:3000/auth/register', payload);
  }
  login(payload: any) {
    return this.http.post('http://127.0.0.1:3000/auth/login', payload)
      .pipe(
        tap((response: any) => this.storeJwtTokens(response))
      );
  }

  resendRecoveryCode(payload: any) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/resend-request', payload);
  }

  startPasswordRecovery(payload: any) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/start', payload);
  }

  verifyRecoveryCode(payload: any) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/verify', payload);
  }

  requestPasswordChange(payload: any) {
    return this.http.post('http://127.0.0.1:3000/auth/passwords/recovery/reset', payload);
  }


  private storeJwtTokens(tokens: any) {
    localStorage.setItem(JWT_TOKENS, JSON.stringify(tokens));
  }

  public getJwtTokens() {
    const tokens = localStorage.getItem(JWT_TOKENS);
    if ( !tokens ) {
      return null;
    }

    try {
      return JSON.parse(tokens);
    }
    catch(e) {
      return null;
    }
  }
}
