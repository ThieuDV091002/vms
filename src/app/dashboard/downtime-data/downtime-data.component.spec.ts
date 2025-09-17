import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeDataComponent } from './downtime-data.component';

describe('DowntimeDataComponent', () => {
  let component: DowntimeDataComponent;
  let fixture: ComponentFixture<DowntimeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DowntimeDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DowntimeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
