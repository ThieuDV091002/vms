import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportShiftsComponent } from './support-shifts.component';

describe('SupportShiftsComponent', () => {
  let component: SupportShiftsComponent;
  let fixture: ComponentFixture<SupportShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportShiftsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
