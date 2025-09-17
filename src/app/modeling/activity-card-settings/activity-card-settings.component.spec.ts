import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardSettingsComponent } from './activity-card-settings.component';

describe('ActivityCardSettingsComponent', () => {
  let component: ActivityCardSettingsComponent;
  let fixture: ComponentFixture<ActivityCardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
