import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSeriesComponent } from './product-series.component';

describe('ProductSeriesComponent', () => {
  let component: ProductSeriesComponent;
  let fixture: ComponentFixture<ProductSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSeriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
