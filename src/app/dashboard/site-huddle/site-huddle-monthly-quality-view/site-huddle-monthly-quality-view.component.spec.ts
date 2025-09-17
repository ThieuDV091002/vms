import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHuddleMonthlyQualityViewComponent } from './site-huddle-monthly-quality-view.component';

describe('SiteHuddleMonthlyQualityViewComponent', () => {
  let component: SiteHuddleMonthlyQualityViewComponent;
  let fixture: ComponentFixture<SiteHuddleMonthlyQualityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHuddleMonthlyQualityViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteHuddleMonthlyQualityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
