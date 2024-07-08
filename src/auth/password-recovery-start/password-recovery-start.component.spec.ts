import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryStartComponent } from './password-recovery-start.component';

describe('PasswordRecoveryStartComponent', () => {
  let component: PasswordRecoveryStartComponent;
  let fixture: ComponentFixture<PasswordRecoveryStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryStartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
