import { ComponentFixture, TestBed } from '@angular/core/testing';

import {LocalDowntimeReasonsComponent } from './local-downtime-reasons.component';

describe('LocalDowntimeReasonsComponent', () => {
  let component: LocalDowntimeReasonsComponent;
  let fixture: ComponentFixture<LocalDowntimeReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalDowntimeReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalDowntimeReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
