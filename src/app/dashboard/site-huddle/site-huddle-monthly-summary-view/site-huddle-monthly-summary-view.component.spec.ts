import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHuddleMonthlySummaryViewComponent } from './site-huddle-monthly-summary-view.component';

describe('SiteHuddleMonthlySummaryViewComponent', () => {
  let component: SiteHuddleMonthlySummaryViewComponent;
  let fixture: ComponentFixture<SiteHuddleMonthlySummaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHuddleMonthlySummaryViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteHuddleMonthlySummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
