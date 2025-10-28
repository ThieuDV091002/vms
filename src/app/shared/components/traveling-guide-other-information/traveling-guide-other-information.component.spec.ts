import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingGuideOtherInformationComponent } from './traveling-guide-other-information.component';

describe('TravelingGuideOtherInformationComponent', () => {
  let component: TravelingGuideOtherInformationComponent;
  let fixture: ComponentFixture<TravelingGuideOtherInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingGuideOtherInformationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelingGuideOtherInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
