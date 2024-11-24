import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  profile(id: number) {
    return this.http.get(`http://127.0.0.1:3000/users/${id}`).pipe(
      map((user: any) => ({
        ...user,
        ...(!user.profilePictureUrl
          ? { profilePictureUrl: './assets/images/user-image-unavailable.png' }
          : {})
      }))
    );
  }
}
