import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalDowntimeCodesComponent } from './global-downtime-codes.component';

describe('GlobalDowntimeCodesComponent', () => {
  let component: GlobalDowntimeCodesComponent;
  let fixture: ComponentFixture<GlobalDowntimeCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalDowntimeCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalDowntimeCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
