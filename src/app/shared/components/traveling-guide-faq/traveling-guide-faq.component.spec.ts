import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingGuideFaqComponent } from './traveling-guide-faq.component';

describe('TravelingGuideFaqComponent', () => {
  let component: TravelingGuideFaqComponent;
  let fixture: ComponentFixture<TravelingGuideFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingGuideFaqComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelingGuideFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
