import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelGuidePageComponent } from './travel-guide-page.component';

describe('TravelGuidePageComponent', () => {
  let component: TravelGuidePageComponent;
  let fixture: ComponentFixture<TravelGuidePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelGuidePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelGuidePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
