import { TestBed } from '@angular/core/testing';

import { BookPostResolverService } from './book-post-resolver.service';

describe('BookPostResolverService', () => {
  let service: BookPostResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookPostResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
