import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteHuddleMonthlyProductivityViewComponent } from './site-huddle-monthly-productivity-view.component';

describe('SiteHuddleMonthlyProductivityViewComponent', () => {
  let component: SiteHuddleMonthlyProductivityViewComponent;
  let fixture: ComponentFixture<SiteHuddleMonthlyProductivityViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHuddleMonthlyProductivityViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteHuddleMonthlyProductivityViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
