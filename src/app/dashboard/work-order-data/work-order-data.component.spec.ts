import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderDataComponent } from './work-order-data.component';

describe('WorkOrderDataComponent', () => {
  let component: WorkOrderDataComponent;
  let fixture: ComponentFixture<WorkOrderDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkOrderDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkOrderDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
