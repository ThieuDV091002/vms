import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoListManageWidgetComponent } from './todo-list-manage-widget.component';

describe('TodoListManageWidgetComponent', () => {
  let component: TodoListManageWidgetComponent;
  let fixture: ComponentFixture<TodoListManageWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListManageWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodoListManageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
