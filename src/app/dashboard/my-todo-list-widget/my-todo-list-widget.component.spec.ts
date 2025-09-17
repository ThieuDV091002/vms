import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTodoListWidgetComponent } from './my-todo-list-widget.component';

describe('MyTodoListWidgetComponent', () => {
  let component: MyTodoListWidgetComponent;
  let fixture: ComponentFixture<MyTodoListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyTodoListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyTodoListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
