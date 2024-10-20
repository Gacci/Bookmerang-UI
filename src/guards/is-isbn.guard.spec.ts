import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isIsbnGuard } from './is-isbn.guard';

describe('isIsbnGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isIsbnGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
