import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitFeaturesComponent } from './visit-features.component';

describe('VisitFeaturesComponent', () => {
  let component: VisitFeaturesComponent;
  let fixture: ComponentFixture<VisitFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitFeaturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
