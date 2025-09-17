import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetySiteInfoWidgetComponent } from './safety-site-info-widget.component';

describe('SafetySiteInfoWidgetComponent', () => {
  let component: SafetySiteInfoWidgetComponent;
  let fixture: ComponentFixture<SafetySiteInfoWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetySiteInfoWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetySiteInfoWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
