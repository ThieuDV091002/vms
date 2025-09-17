import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCardCategoriesComponent } from './activity-card-categories.component';

describe('ActivityCardCategoriesComponent', () => {
  let component: ActivityCardCategoriesComponent;
  let fixture: ComponentFixture<ActivityCardCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCardCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCardCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
