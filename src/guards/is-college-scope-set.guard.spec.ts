import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isCollegeScopeSetGuard } from './is-college-scope-set.guard';

describe('isCollegeScopeSetGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isCollegeScopeSetGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
