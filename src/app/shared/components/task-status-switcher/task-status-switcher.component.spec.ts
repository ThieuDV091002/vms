import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatusSwitcherComponent } from './task-status-switcher.component';

describe('TaskStatusSwitcherComponent', () => {
  let component: TaskStatusSwitcherComponent;
  let fixture: ComponentFixture<TaskStatusSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskStatusSwitcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskStatusSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
