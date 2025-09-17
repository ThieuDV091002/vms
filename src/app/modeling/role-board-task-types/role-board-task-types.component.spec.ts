import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBoardTaskTypesComponent } from './role-board-task-types.component';

describe('RoleBoardComponent', () => {
  let component: RoleBoardTaskTypesComponent;
  let fixture: ComponentFixture<RoleBoardTaskTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBoardTaskTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleBoardTaskTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
