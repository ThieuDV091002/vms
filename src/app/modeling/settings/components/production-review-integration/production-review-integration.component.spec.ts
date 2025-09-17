import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewIntegrationComponent } from './production-review-integration.component';

describe('ProductionReviewIntegrationComponent', () => {
  let component: ProductionReviewIntegrationComponent;
  let fixture: ComponentFixture<ProductionReviewIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewIntegrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionReviewIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
