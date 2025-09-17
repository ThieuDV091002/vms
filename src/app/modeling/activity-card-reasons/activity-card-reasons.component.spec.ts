import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardReasonsComponent } from './activity-card-reasons.component';

describe('ActivityCardReasonsComponent', () => {
  let component: ActivityCardReasonsComponent;
  let fixture: ComponentFixture<ActivityCardReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardReasonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCardReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
