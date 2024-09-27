import { TestBed } from '@angular/core/testing';

import { BooksCollectionResolverService } from './books-collection-resolver.service';

describe('BooksCollectionResolverService', () => {
  let service: BooksCollectionResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BooksCollectionResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
