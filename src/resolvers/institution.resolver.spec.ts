import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { institutionResolver } from './institution.resolver';

describe('institutionResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      institutionResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
