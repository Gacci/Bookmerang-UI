import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksPricingComponent } from './books-pricing.component';

describe('BooksPricingComponent', () => {
  let component: BooksPricingComponent;
  let fixture: ComponentFixture<BooksPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksPricingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
