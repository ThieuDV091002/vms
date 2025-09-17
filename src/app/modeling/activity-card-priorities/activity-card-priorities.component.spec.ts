import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardPrioritiesComponent } from './activity-card-priorities.component';

describe('ActivityCardPrioritiesComponent', () => {
  let component: ActivityCardPrioritiesComponent;
  let fixture: ComponentFixture<ActivityCardPrioritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardPrioritiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCardPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
