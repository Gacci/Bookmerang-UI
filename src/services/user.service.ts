import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  profile(id: number) {
    return this.http.get(`http://127.0.0.1:3000/users/${id}`);
  }
}
