import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellSettingsComponent } from './cell-settings.component';

describe('CellSettingsComponent', () => {
  let component: CellSettingsComponent;
  let fixture: ComponentFixture<CellSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CellSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
