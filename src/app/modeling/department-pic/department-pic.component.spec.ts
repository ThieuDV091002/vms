import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentPicComponent } from './department-pic.component';

describe('DepartmentPicComponent', () => {
  let component: DepartmentPicComponent;
  let fixture: ComponentFixture<DepartmentPicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentPicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
