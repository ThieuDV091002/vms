import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSettingsComponent } from './area-settings.component';

describe('StateComponent', () => {
  let component: AreaSettingsComponent;
  let fixture: ComponentFixture<AreaSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
