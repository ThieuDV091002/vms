import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBoardIntegrationComponent } from './role-board-integration.component';

describe('RoleBoardIntegrationComponent', () => {
  let component: RoleBoardIntegrationComponent;
  let fixture: ComponentFixture<RoleBoardIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBoardIntegrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoleBoardIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
