import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetTemplateComponent } from './widget-template.component';

describe('WidgetTemplateComponent', () => {
  let component: WidgetTemplateComponent;
  let fixture: ComponentFixture<WidgetTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WidgetTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
