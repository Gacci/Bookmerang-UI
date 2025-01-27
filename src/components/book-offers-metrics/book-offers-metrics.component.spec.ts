import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOffersMetricsComponent } from './book-offers-metrics.component';

describe('BookOffersMetricsComponent', () => {
  let component: BookOffersMetricsComponent;
  let fixture: ComponentFixture<BookOffersMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookOffersMetricsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookOffersMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
