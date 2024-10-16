import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { inventoryResolver } from './inventory.resolver';

describe('inventoryResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => inventoryResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
