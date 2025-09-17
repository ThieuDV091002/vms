import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReviewMachineFocusComponent } from './production-review-machine-focus.component';

describe('ProductionReviewMachineFocusWidgetComponent', () => {
  let component: ProductionReviewMachineFocusComponent;
  let fixture: ComponentFixture<ProductionReviewMachineFocusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionReviewMachineFocusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionReviewMachineFocusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
