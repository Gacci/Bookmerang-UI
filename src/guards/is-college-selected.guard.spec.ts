import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isCollegeSelectedGuard } from './is-college-selected.guard';

describe('isCollegeSelectedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      isCollegeSelectedGuard(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
