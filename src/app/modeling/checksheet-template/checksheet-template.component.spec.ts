import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecksheetTemplateComponent } from './checksheet-template.component';

describe('ChecksheetTemplateComponent', () => {
  let component: ChecksheetTemplateComponent;
  let fixture: ComponentFixture<ChecksheetTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecksheetTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChecksheetTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});