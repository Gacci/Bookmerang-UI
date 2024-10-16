import { TestBed } from '@angular/core/testing';

import { BookValuatorService } from './book-valuator.service';

describe('BookValuatorService', () => {
  let service: BookValuatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookValuatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
