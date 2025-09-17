import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHuddleMonthlyViewComponent } from './site-huddle-monthly-view.component';

describe('SiteHuddleMonthlyViewComponent', () => {
  let component: SiteHuddleMonthlyViewComponent;
  let fixture: ComponentFixture<SiteHuddleMonthlyViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHuddleMonthlyViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteHuddleMonthlyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
