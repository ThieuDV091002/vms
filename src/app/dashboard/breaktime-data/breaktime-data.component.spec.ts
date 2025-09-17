import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreaktimeDataComponent } from './breaktime-data.component';

describe('BreaktimeDataComponent', () => {
  let component: BreaktimeDataComponent;
  let fixture: ComponentFixture<BreaktimeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreaktimeDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BreaktimeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
