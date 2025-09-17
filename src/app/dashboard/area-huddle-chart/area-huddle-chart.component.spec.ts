import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaHuddleChartComponent } from './area-huddle-chart.component';

describe('AreaHuddleChartComponent', () => {
  let component: AreaHuddleChartComponent;
  let fixture: ComponentFixture<AreaHuddleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaHuddleChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaHuddleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
