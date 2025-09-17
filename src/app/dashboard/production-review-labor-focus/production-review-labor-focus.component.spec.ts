import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewLaborFocusComponent } from './production-review-labor-focus.component';

describe('ProductionReviewMachineFocusWidgetComponent', () => {
  let component: ProductionReviewLaborFocusComponent;
  let fixture: ComponentFixture<ProductionReviewLaborFocusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewLaborFocusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionReviewLaborFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
