import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReworkQtyDataComponent } from './rework-qty-data.component';

describe('ReworkQtyDataComponent', () => {
  let component: ReworkQtyDataComponent;
  let fixture: ComponentFixture<ReworkQtyDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReworkQtyDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReworkQtyDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
