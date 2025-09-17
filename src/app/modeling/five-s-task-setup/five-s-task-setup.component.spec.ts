import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveSTaskSetupComponent } from './five-s-task-setup.component';

describe('FiveSTaskSetupComponent', () => {
  let component: FiveSTaskSetupComponent;
  let fixture: ComponentFixture<FiveSTaskSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiveSTaskSetupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FiveSTaskSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
