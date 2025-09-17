import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlWidgetComponent } from './url-widgetcomponent';

describe('UrlDashboardComponent', () => {
  let component: UrlWidgetComponent;
  let fixture: ComponentFixture<UrlWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UrlWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
