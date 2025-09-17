import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataIntegrationSettingsComponent } from './data-integration-settings.component';

describe('DataIntegrationSettingsComponent', () => {
  let component: DataIntegrationSettingsComponent;
  let fixture: ComponentFixture<DataIntegrationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataIntegrationSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataIntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
