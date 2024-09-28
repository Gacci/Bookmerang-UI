import { TestBed } from '@angular/core/testing';

import { BookResolverService } from './book-resolver.service';

describe('BookResolverService', () => {
  let service: BookResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
