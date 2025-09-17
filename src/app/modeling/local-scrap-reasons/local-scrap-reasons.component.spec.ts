import { ComponentFixture, TestBed } from '@angular/core/testing';

import {LocalScrapReasonsComponent } from './local-scrap-reasons.component';

describe('LocalScrapReasonsComponent', () => {
  let component: LocalScrapReasonsComponent;
  let fixture: ComponentFixture<LocalScrapReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalScrapReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalScrapReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
