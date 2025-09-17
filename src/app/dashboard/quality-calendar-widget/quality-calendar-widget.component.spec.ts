import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCalendarWidgetComponent } from './quality-calendar-widget.component';

describe('QualityCalendarWidgetComponent', () => {
  let component: QualityCalendarWidgetComponent;
  let fixture: ComponentFixture<QualityCalendarWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityCalendarWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QualityCalendarWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
