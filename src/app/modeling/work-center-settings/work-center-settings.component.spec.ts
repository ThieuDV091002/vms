import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCenterSettingsComponent } from './work-center-settings.component';

describe('WorkCenterSettingsComponent', () => {
  let component: WorkCenterSettingsComponent;
  let fixture: ComponentFixture<WorkCenterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCenterSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkCenterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
