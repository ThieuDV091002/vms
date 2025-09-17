import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapQtyDataComponent } from './scrap-qty-data.component';

describe('ScrapQtyDataComponent', () => {
  let component: ScrapQtyDataComponent;
  let fixture: ComponentFixture<ScrapQtyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrapQtyDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrapQtyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
