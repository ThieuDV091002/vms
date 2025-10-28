import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingGuideHeadingComponent } from './traveling-guide-heading.component';

describe('TravelingGuideHeadingComponent', () => {
  let component: TravelingGuideHeadingComponent;
  let fixture: ComponentFixture<TravelingGuideHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingGuideHeadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelingGuideHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
