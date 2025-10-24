import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitFooterComponent } from './visit-footer.component';

describe('VisitFooterComponent', () => {
  let component: VisitFooterComponent;
  let fixture: ComponentFixture<VisitFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
