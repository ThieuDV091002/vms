import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToVietnam } from './to-vietnam';

describe('ToVietnam', () => {
  let component: ToVietnam;
  let fixture: ComponentFixture<ToVietnam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToVietnam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToVietnam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
