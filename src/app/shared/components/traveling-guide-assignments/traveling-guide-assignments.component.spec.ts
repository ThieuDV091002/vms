import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingGuideAssignmentsComponent } from './traveling-guide-assignments.component';

describe('TravelingGuideAssignmentsComponent', () => {
  let component: TravelingGuideAssignmentsComponent;
  let fixture: ComponentFixture<TravelingGuideAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingGuideAssignmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelingGuideAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
