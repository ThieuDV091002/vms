import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationAppComponent } from './transportation-app.component';

describe('TransportationAppComponent', () => {
  let component: TransportationAppComponent;
  let fixture: ComponentFixture<TransportationAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransportationAppComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransportationAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
