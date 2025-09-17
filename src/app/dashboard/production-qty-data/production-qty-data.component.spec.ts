import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionQtyDataComponent } from './production-qty-data.component';

describe('ProductionQtyDataComponent', () => {
  let component: ProductionQtyDataComponent;
  let fixture: ComponentFixture<ProductionQtyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionQtyDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionQtyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
