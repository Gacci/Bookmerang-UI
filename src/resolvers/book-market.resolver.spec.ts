import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { bookMarketResolver } from './book-market.resolver';

describe('bookMarketResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => bookMarketResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
