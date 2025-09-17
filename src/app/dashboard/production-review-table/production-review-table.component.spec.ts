import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewTableComponent } from './production-review-table.component';

describe('ProductionReviewTableComponent', () => {
  let component: ProductionReviewTableComponent;
  let fixture: ComponentFixture<ProductionReviewTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionReviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
