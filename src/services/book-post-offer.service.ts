import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookPostOfferService {

  constructor(private http: HttpClient) { }

  search(params: Data) {
    return this.http.get('http://127.0.0.1:3000/books/markets/search', { params })
  }
}
