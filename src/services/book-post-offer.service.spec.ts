import { TestBed } from '@angular/core/testing';

import { BookPostOfferService } from './book-post-offer.service';

describe('BookPostOfferService', () => {
  let service: BookPostOfferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookPostOfferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
