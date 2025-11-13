import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticGuestFormComponent } from './domestic-guest-form.component';

describe('DomesticGuestFormComponent', () => {
  let component: DomesticGuestFormComponent;
  let fixture: ComponentFixture<DomesticGuestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticGuestFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomesticGuestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
