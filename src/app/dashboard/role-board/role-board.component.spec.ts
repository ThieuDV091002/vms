import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBoardComponent } from './role-board.component';

describe('RoleBoardComponent', () => {
  let component: RoleBoardComponent;
  let fixture: ComponentFixture<RoleBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBoardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
