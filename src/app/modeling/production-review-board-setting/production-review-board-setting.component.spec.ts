import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewBoardSettingComponent } from './production-review-board-setting.component';

describe('ProductionReviewBoardSettingComponent', () => {
  let component: ProductionReviewBoardSettingComponent;
  let fixture: ComponentFixture<ProductionReviewBoardSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewBoardSettingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionReviewBoardSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
