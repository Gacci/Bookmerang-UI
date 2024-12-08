import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data } from '@angular/router';

import { Institution } from '../interfaces/institution.interface';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  constructor(private http: HttpClient) {}

  read(id: number) {
    return this.http.get<Institution>(
      `http://127.0.0.1:3000/academics/institutions/${id}`
    );
  }

  search(params: Data) {
    return this.http.get<{ count: number; data: Institution[] }>(
      'http://127.0.0.1:3000/academics/institutions/search',
      {
        params
      }
    );
  }
}
