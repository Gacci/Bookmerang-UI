import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AcademicProgramService {

  constructor(private http: HttpClient) { }

  read(id: number) {
    return this.http.get('http://127.0.0.1:3000/academics/programs/${id}');
  }

  dump() {
    return this.http.get<any[]>('http://127.0.0.1:3000/academics/programs');
  }
}
