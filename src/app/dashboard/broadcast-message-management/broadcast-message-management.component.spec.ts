import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastMessageManagementComponent } from './broadcast-message-management.component';

describe('BroadcastMessageManagementComponent', () => {
  let component: BroadcastMessageManagementComponent;
  let fixture: ComponentFixture<BroadcastMessageManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastMessageManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BroadcastMessageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
