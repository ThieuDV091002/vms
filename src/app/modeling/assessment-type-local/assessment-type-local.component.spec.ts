import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentTypeLocalComponent } from './assessment-type-local.component';

describe('AssessmentTypeLocalComponent', () => {
  let component: AssessmentTypeLocalComponent;
  let fixture: ComponentFixture<AssessmentTypeLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentTypeLocalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentTypeLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
