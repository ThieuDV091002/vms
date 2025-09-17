import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborDataComponent } from './labor-data.component';

describe('LaborDataComponent', () => {
  let component: LaborDataComponent;
  let fixture: ComponentFixture<LaborDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaborDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaborDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
