import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardSingleComponent } from './standard-single.component';

describe('StandardWidgetComponent', () => {
  let component: StandardSingleComponent;
  let fixture: ComponentFixture<StandardSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardSingleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
