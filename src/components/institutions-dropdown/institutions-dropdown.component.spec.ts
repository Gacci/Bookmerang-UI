import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionsDropdownComponent } from './institutions-dropdown.component';

describe('InstitutionsDropdownComponent', () => {
  let component: InstitutionsDropdownComponent;
  let fixture: ComponentFixture<InstitutionsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstitutionsDropdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(InstitutionsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
