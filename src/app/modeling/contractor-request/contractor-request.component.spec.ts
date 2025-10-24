import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorRequestComponent } from './contractor-request.component';

describe('ContractorRequestComponent', () => {
  let component: ContractorRequestComponent;
  let fixture: ComponentFixture<ContractorRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractorRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContractorRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
