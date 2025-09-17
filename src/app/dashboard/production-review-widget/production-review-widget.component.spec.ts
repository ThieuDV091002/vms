import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewWidgetComponent } from './production-review-widget.component';

describe('ProductionReviewWidgetComponent', () => {
  let component: ProductionReviewWidgetComponent;
  let fixture: ComponentFixture<ProductionReviewWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionReviewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
