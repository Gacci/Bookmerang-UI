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
    return this.http.post('http://127.0.0.1:3000/books/markets', body);
  }

  read(bookOfferId: number) {
    return this.http.get(`http://127.0.0.1:3000/books/markets/${bookOfferId}`);
  }

  update(body: any) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/${body.bookOfferId}`,
      body
    );
  }

  remove(bookOfferId: number) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/${bookOfferId}`
    );
  }

  // ONLY COVER on populate
  search(params: Data) {
    return this.http
      .get('http://127.0.0.1:3000/books/markets/search', {
        params
      })
      .pipe(
        map((response: any) => {
          return response.map((post: any) => ({
            ...post,
            ...(!post.user?.profilePictureUrl
              ? {
                  user: {
                    ...post.user,
                    profilePictureUrl:
                      './assets/images/user-image-unavailable.png'
                  }
                }
              : {}),
            book: this.books.populate(post.book)
          }));
        })
      );
  }

  metrics(params: any) {
    return this.http.get<any[]>('http://127.0.0.1:3000/books/markets/metrics', {
      params: { institutionId: params.scope, isbn13: params.isbn13 }
    });
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

  likeBookPost(bookOfferId: number) {
    return this.http.post('http://127.0.0.1:3000/books/markets/favorites', {
      bookOfferId
    });
  }

  unlikeBookPost(bookOfferId: number) {
    return this.http.delete(
      `http://127.0.0.1:3000/books/markets/favorites/${bookOfferId}`
    );
  }

  favorites(params: Data) {
    return this.http
      .get('http://127.0.0.1:3000/books/markets/favorites/search', {
        params
      })
      .pipe(
        map((response: any) => {
          return response.map((post: any) => ({
            ...post,
            book: this.books.populate(post.book)
          }));
        })
      );
  }
}
