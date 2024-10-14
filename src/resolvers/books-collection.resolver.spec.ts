import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { booksCollectionResolver } from './books-collection.resolver';

describe('booksCollectionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      booksCollectionResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
