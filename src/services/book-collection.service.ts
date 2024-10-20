import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Data } from '@angular/router';
import { map } from 'rxjs';

import ISO6391 from 'iso-639-1';
import * as ISBN from 'isbn3';

@Injectable({
  providedIn: 'root'
})
export class BookCollectionService {
  constructor(private http: HttpClient) {}

  read(isbn13: string) {
    return this.http
      .get(`http://127.0.0.1:3000/books/collections/isbn/${isbn13}`)
      .pipe(
        map((book: any) => ({
          ...book,
          ...(book.isbn10 && !book.isbn13
            ? { isbn13: ISBN.asIsbn13(book.isbn10) }
            : {}),
          ...(book.isbn13 && !book.isbn10
            ? { isbn13: ISBN.asIsbn10(book.isbn13) }
            : {}),
          ...(book.language
            ? {
                language:
                  ISO6391.getName(book.language) ?? book.language?.toUpperCase()
              }
            : {}),
          ...(!book.thumbnail
            ? { thumbnail: './assets/images/book-cover-unavailable.jpeg' }
            : {})
        }))
      );
  }

  search(params: Data) {
    return this.http
      .get<
        Array<any>
      >('http://127.0.0.1:3000/books/collections/search', { params })
      .pipe(
        map((response: any) => ({
          meta: response.meta,
          data: response.data.map((book: any) => ({
            ...book,
            ...(!book.thumbnail
              ? { thumbnail: './assets/images/book-cover-unavailable.jpeg' }
              : {})
          }))
        }))
      );
  }
}
