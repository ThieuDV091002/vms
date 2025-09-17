import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZeroIncidentByDaysWidgetComponent } from './zero-incident-by-days-widget.component';

describe('ZeroIncidentByDaysWidgetComponent', () => {
  let component: ZeroIncidentByDaysWidgetComponent;
  let fixture: ComponentFixture<ZeroIncidentByDaysWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZeroIncidentByDaysWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZeroIncidentByDaysWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
