import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTileCardComponent } from './post-tile-card.component';

describe('PostTileCardComponent', () => {
  let component: PostTileCardComponent;
  let fixture: ComponentFixture<PostTileCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTileCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PostTileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
