import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomesticGuestComponent } from './domestic-guest.component';

describe('DomesticGuestComponent', () => {
  let component: DomesticGuestComponent;
  let fixture: ComponentFixture<DomesticGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomesticGuestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DomesticGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
