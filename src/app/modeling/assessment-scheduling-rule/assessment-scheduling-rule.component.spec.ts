import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentSchedulingRuleComponent } from './assessment-scheduling-rule.component';

describe('AssessmentSchedulingRuleComponent', () => {
  let component: AssessmentSchedulingRuleComponent;
  let fixture: ComponentFixture<AssessmentSchedulingRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentSchedulingRuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentSchedulingRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
