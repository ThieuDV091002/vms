import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingGuideToOtherCountriesComponent } from './traveling-guide-to-other-countries.component';

describe('TravelingGuideToOtherCountriesComponent', () => {
  let component: TravelingGuideToOtherCountriesComponent;
  let fixture: ComponentFixture<TravelingGuideToOtherCountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingGuideToOtherCountriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelingGuideToOtherCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
