import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaHuddleKpiTableComponent } from './area-huddle-kpi-table.component';

describe('AreaHuddleKpiTableComponent', () => {
  let component: AreaHuddleKpiTableComponent;
  let fixture: ComponentFixture<AreaHuddleKpiTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaHuddleKpiTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaHuddleKpiTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
