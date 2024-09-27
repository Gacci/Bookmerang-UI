import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksMarketsComponent } from './books-markets.component';

describe('BooksMarketsComponent', () => {
  let component: BooksMarketsComponent;
  let fixture: ComponentFixture<BooksMarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksMarketsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
