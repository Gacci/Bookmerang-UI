import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { bookFavoriteResolver } from './book-favorite.resolver';

describe('bookFavoriteResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      bookFavoriteResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
