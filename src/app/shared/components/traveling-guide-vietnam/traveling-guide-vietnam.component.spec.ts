import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelingGuideVietnamComponent } from './traveling-guide-vietnam.component';

describe('TravelingGuideVietnamComponent', () => {
  let component: TravelingGuideVietnamComponent;
  let fixture: ComponentFixture<TravelingGuideVietnamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelingGuideVietnamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TravelingGuideVietnamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
