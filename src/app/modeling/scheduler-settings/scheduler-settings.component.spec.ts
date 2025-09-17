import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerSettingsComponent } from './scheduler-settings.component';

describe('SchedulerSettingsComponent', () => {
  let component: SchedulerSettingsComponent;
  let fixture: ComponentFixture<SchedulerSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});