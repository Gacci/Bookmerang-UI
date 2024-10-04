import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BookMarketService {
  constructor(private http: HttpClient) {}

  create(body: any) {
    return this.http.post('http://127.0.0.1:3000/books/markets', body);
  }

  search(params: Data) {
    console.log('BookPostOfferService.search', params);

    return this.http.get('http://127.0.0.1:3000/books/markets/search', {
      params
    });
  }

  metrics(isbn13: string) {
    console.log('BookPostOfferService.metrics', isbn13);

    return this.http.get('http://127.0.0.1:3000/books/markets/metrics', {
      params: { isbn13 }
    });
  }
}