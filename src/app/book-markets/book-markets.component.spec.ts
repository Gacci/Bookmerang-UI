import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookMarketsComponent } from './book-markets.component';

describe('BookMarketsComponent', () => {
  let component: BookMarketsComponent;
  let fixture: ComponentFixture<BookMarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookMarketsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
