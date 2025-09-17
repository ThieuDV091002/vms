import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellHuddleChartWidgetComponent } from './cell-huddle-chart-widget.component';

describe('CellHuddleChartWidgetComponent', () => {
  let component: CellHuddleChartWidgetComponent;
  let fixture: ComponentFixture<CellHuddleChartWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellHuddleChartWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CellHuddleChartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
