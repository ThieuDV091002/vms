import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerBiWidgetComponent } from './power-bi-widget.component';

describe('PowerBiWidgetComponent', () => {
  let component: PowerBiWidgetComponent;
  let fixture: ComponentFixture<PowerBiWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowerBiWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PowerBiWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
