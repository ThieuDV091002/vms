import { ComponentFixture, TestBed } from '@angular/core/testing';

import {  AssignedRolesComponent } from './assigned-roles.component';

describe(' AssignedRolesComponent', () => {
  let component:  AssignedRolesComponent;
  let fixture: ComponentFixture< AssignedRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AssignedRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent( AssignedRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
