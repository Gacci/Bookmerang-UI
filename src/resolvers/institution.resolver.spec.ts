import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { institutionResolver } from './institution.resolver';
import { Scope } from '../interfaces/scope.interface';

describe('institutionResolver', () => {
  const executeResolver: ResolveFn<Scope[]> = (...resolverParameters) =>
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
