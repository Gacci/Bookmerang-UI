import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isCollegeEnrolledGuard } from './is-college-enrolled.guard';

describe('isCollegeEnrolledGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      isCollegeEnrolledGuard(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
