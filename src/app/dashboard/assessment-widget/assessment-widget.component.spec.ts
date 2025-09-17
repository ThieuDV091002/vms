import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentWidgetComponent } from './assessment-widget.component';

describe('AssessmentWidgetComponent', () => {
  let component: AssessmentWidgetComponent;
  let fixture: ComponentFixture<AssessmentWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentWidgetComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AssessmentWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
