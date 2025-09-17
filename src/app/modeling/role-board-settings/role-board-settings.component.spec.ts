import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBoardSettingsComponent } from './role-board-settings.component';

describe('StateComponent', () => {
  let component: RoleBoardSettingsComponent;
  let fixture: ComponentFixture<RoleBoardSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBoardSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleBoardSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
