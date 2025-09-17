import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTierFilterComponent } from './data-tier-filter.component';

describe('DataTierFilterComponent', () => {
  let component: DataTierFilterComponent;
  let fixture: ComponentFixture<DataTierFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTierFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DataTierFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
