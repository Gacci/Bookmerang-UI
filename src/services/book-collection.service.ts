import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Data } from '@angular/router';
import { map } from 'rxjs';

import ISO6391 from 'iso-639-1';
import * as ISBN from 'isbn3';
import { BookService } from './book.service';

@Injectable({
  providedIn: 'root'
})
export class BookCollectionService {
  constructor(
    private http: HttpClient,
    private books: BookService
  ) {}

  read(isbn13: string) {
    return this.http
      .get(`http://127.0.0.1:3000/books/collections/isbn/${isbn13}`)
      .pipe(map((book: any) => this.books.populate(book)));
  }

  // ONLY COVER on populate
  search(params: Data) {
    return this.http
      .get<
        Array<any>
      >('http://127.0.0.1:3000/books/collections/search', { params })
      .pipe(
        map((response: any) => ({
          data: response.data.map((book: any) => this.books.populate(book)),
          meta: response.meta
        }))
      );
  }
}
