import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isbnGuard } from './isbn.guard';

describe('isbnGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isbnGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
