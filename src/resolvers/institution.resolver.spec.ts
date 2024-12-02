import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { institutionResolver } from './institution.resolver';
import { Institution } from '../interfaces/institution.interface';

describe('institutionResolver', () => {
  const executeResolver: ResolveFn<Institution[]> = (...resolverParameters) =>
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
