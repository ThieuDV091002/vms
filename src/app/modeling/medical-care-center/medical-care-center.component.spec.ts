import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalCareCenterComponent } from './medical-care-center.component';

describe('MedicalCareCenterComponent', () => {
  let component: MedicalCareCenterComponent;
  let fixture: ComponentFixture<MedicalCareCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalCareCenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalCareCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
