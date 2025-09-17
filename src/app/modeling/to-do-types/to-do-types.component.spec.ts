import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTypesComponent } from './to-do-types.component';

describe('ToDoTypesComponent', () => {
  let component: ToDoTypesComponent;
  let fixture: ComponentFixture<ToDoTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToDoTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
