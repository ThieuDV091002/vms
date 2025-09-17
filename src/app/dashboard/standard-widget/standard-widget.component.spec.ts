import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardWidgetComponent } from './standard-widget.component';

describe('StandardMultiComponent', () => {
  let component: StandardWidgetComponent;
  let fixture: ComponentFixture<StandardWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
