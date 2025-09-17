import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardWidgetComponent } from './activity-card-widget.component';

describe('ActivityCardComponent', () => {
  let component: ActivityCardWidgetComponent;
  let fixture: ComponentFixture<ActivityCardWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityCardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
