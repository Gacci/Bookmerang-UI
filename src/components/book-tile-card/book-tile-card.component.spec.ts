import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookTileCardComponent } from './book-tile-card.component';

describe('BookTileCardComponent', () => {
  let component: BookTileCardComponent;
  let fixture: ComponentFixture<BookTileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookTileCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookTileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
