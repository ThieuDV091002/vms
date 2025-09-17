import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardAloneComponent } from './standard-alone.component';

describe('StandardAloneComponent', () => {
  let component: StandardAloneComponent;
  let fixture: ComponentFixture<StandardAloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardAloneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardAloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
