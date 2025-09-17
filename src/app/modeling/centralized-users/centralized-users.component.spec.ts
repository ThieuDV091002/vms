import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralizedUsersComponent } from './centralized-users.component';

describe('CentrailzedUsersComponent', () => {
  let component: CentralizedUsersComponent;
  let fixture: ComponentFixture<CentralizedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralizedUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentralizedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
