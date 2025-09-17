import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftPatternsComponent } from './shift-patterns.component';

describe('ShiftPatternsComponent', () => {
  let component: ShiftPatternsComponent;
  let fixture: ComponentFixture<ShiftPatternsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftPatternsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShiftPatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
