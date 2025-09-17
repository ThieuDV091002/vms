import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFunctionsComponent } from './job-functions.component';

describe('JobFunctionsComponent', () => {
  let component: JobFunctionsComponent;
  let fixture: ComponentFixture<JobFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobFunctionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
