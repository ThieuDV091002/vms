import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStandardsComponent } from './view-standards.component';

describe('ViewStandardsComponent', () => {
  let component: ViewStandardsComponent;
  let fixture: ComponentFixture<ViewStandardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewStandardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewStandardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
