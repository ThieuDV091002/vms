import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewBoardComponent } from './production-review-board.component';

describe('ProductionReviewBoardComponent', () => {
  let component: ProductionReviewBoardComponent;
  let fixture: ComponentFixture<ProductionReviewBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionReviewBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
