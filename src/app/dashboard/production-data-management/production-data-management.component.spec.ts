import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionDataManagementComponent } from './production-data-management.component';

describe('ProductionDataManagementComponent', () => {
  let component: ProductionDataManagementComponent;
  let fixture: ComponentFixture<ProductionDataManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionDataManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductionDataManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
