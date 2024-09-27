import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCollectionsComponent } from './books-collections.component';

describe('BooksCollectionsComponent', () => {
  let component: BooksCollectionsComponent;
  let fixture: ComponentFixture<BooksCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksCollectionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
