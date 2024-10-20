import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOfferEditSheetComponent } from './book-offer-edit-sheet.component';

describe('BookOfferEditSheetComponent', () => {
  let component: BookOfferEditSheetComponent;
  let fixture: ComponentFixture<BookOfferEditSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookOfferEditSheetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BookOfferEditSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
