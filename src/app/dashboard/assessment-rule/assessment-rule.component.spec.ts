import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRuleComponent } from './assessment-rule.component';

describe('AssessmentRuleComponent', () => {
  let component: AssessmentRuleComponent;
  let fixture: ComponentFixture<AssessmentRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentRuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
