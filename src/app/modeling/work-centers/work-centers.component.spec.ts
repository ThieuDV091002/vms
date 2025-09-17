import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkCentersComponent } from './work-centers.component';

describe('WorkCentersComponent', () => {
  let component: WorkCentersComponent;
  let fixture: ComponentFixture<WorkCentersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkCentersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
