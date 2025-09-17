import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHuddleMonthlySafetyViewComponent } from './site-huddle-monthly-safety-view.component';

describe('SiteHuddleMonthlySafetyViewComponent', () => {
  let component: SiteHuddleMonthlySafetyViewComponent;
  let fixture: ComponentFixture<SiteHuddleMonthlySafetyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHuddleMonthlySafetyViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteHuddleMonthlySafetyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
