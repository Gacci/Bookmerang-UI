import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { bookExistsGuard } from './book-exists.guard';

describe('bookExistsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => bookExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
