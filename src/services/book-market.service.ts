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
        map((response: any) =>
          response.map((post: any) => ({
            ...post,
            book: this.books.populate(post.book)
          }))
        )
      );
  }

  metrics(isbn13: string) {
    return this.http.get('http://127.0.0.1:3000/books/markets/posts/metrics', {
      params: { isbn13 }
    });
  }

  likeBookPost(body: Data) {
    return this.http.post(
      'http://127.0.0.1:3000/books/markets/posts/favorites',
      body
    );
  }

  unlikeBookPost(bookOfferId: number) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/posts/favorites/${bookOfferId}`
    );
  }
}
