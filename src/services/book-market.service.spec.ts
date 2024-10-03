import { TestBed } from '@angular/core/testing';

import { BookMarketService } from './book-market.service';

describe('BookMarketService', () => {
  let service: BookMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
