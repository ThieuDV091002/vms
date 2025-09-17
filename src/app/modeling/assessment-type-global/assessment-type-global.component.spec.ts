import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentTypeGlobalComponent } from './assessment-type-global.component';

describe('AssessmentTypeGlobalComponent', () => {
  let component: AssessmentTypeGlobalComponent;
  let fixture: ComponentFixture<AssessmentTypeGlobalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentTypeGlobalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentTypeGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
