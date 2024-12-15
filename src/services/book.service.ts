import { Injectable } from '@angular/core';

import ISO6391 from 'iso-639-1';
import * as ISBN from 'isbn3';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  constructor() {}

  populate(book: any) {
    const haystack =
      (book.title ?? '') + (book.subtitle ?? '') + (book.notes ?? '');
    return {
      ...book,
      ...(book.isbn10 && !book.isbn13
        ? { isbn13: ISBN.asIsbn13(book.isbn10) }
        : {}),
      ...(book.isbn13 && !book.isbn10
        ? { isbn10: ISBN.asIsbn10(book.isbn13) }
        : {}),
      ...(book.title || book.subtitle || book.notes
        ? {
            edition: haystack
              .match(/\d+(st|nd|rd|th) (edition|ed\.?)/gi)
              ?.pop(),
            volume: haystack.match(/(volume|vol\.) \d+/gi)?.pop()
          }
        : {}),
      ...(book.language
        ? {
            language:
              ISO6391.getName(book.language) ?? book.language?.toUpperCase()
          }
        : {}),
      ...(!book.thumbnail
        ? { thumbnail: './assets/images/book-cover-unavailable.jpeg' }
        : { thumbnail: 'http://localhost:3000/' + book.thumbnail })
    };
  }
}
