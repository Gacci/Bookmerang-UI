import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  constructor(private http: HttpClient) { }

  read(id: number) {
    return this.http.get('http://127.0.0.1:3000/academics/insitutions/${id}');
  }

  search(params: Data) {
    return this.http.get('http://127.0.0.1:3000/academics/insitutions', { params });
  }
}
