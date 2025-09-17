import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardTypesComponent } from './activity-card-types.component';

describe('ActivityCardTypesComponent', () => {
  let component: ActivityCardTypesComponent;
  let fixture: ComponentFixture<ActivityCardTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCardTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
