import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTestComponent } from './device-test.component';

describe('DeviceTestComponent', () => {
  let component: DeviceTestComponent;
  let fixture: ComponentFixture<DeviceTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeviceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
