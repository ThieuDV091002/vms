import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentManageComponent } from './assessment-manage.component';

describe('AssessmentManageComponent', () => {
  let component: AssessmentManageComponent;
  let fixture: ComponentFixture<AssessmentManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentManageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssessmentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
