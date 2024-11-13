import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Data } from '@angular/router';
import { map } from 'rxjs';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root'
})
export class BookMarketService {
  constructor(
    private http: HttpClient,
    private books: BookService
  ) {}

  create(body: Data) {
    return this.http.post('http://127.0.0.1:3000/books/markets/posts', body);
  }

  read(bookOfferId: number) {
    return this.http.get(
      `http://127.0.0.1:3000/books/markets/posts/${bookOfferId}`
    );
  }

  update(body: any) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/posts/${body.bookOfferId}`,
      body
    );
  }

  remove(bookOfferId: number) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/posts/${bookOfferId}`
    );
  }

  // ONLY COVER on populate
  search(params: Data) {
    return this.http
      .get('http://127.0.0.1:3000/books/markets/posts/search', {
        params
      })
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.map((post: any) => ({
            ...post,
            book: this.books.populate(post.book)
          }));
        })
      );
  }

  metrics(params: any) {
    return this.http.get<any[]>(
      'http://127.0.0.1:3000/books/markets/posts/metrics',
      {
        params: { institutionId: params.scope, isbn13: params.isbn13 }
      }
    );
  }

  collections(params: Data) {
    return this.http
      .get('http://127.0.0.1:3000/books/markets/collections/search', {
        params
      })
      .pipe(
        map((response: any) => ({
          data: response.data.map((book: any) => this.books.populate(book))
        }))
      );
  }

  likeBookPost(body: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/books/markets/favorites',
      body
    );
  }

  unlikeBookPost(bookOfferId: number) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/favorites/${bookOfferId}`
    );
  }

  favorites(params: Data) {
    return this.http
      .get('http://127.0.0.1:3000/books/markets/favorites/search', { params })
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.map((post: any) => ({
            ...post,
            book: this.books.populate(post.book)
          }));
        })
      );
  }
}
