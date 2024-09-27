import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookCollectionService {

  constructor(private http: HttpClient) { }

  search(params: Data) {
    console.log('BookService', params);

    return this.http.get('http://127.0.0.1:3000/books/collections/search', { params })
  }
}
