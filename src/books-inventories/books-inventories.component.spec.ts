import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksInventoriesComponent } from './books-inventories.component';

describe('BooksInventoriesComponent', () => {
  let component: BooksInventoriesComponent;
  let fixture: ComponentFixture<BooksInventoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksInventoriesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BooksInventoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
