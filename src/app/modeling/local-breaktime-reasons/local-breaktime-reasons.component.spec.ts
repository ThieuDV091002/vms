import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalBreaktimeReasonsComponent } from './local-breaktime-reasons.component';

describe('LocalBreaktimeReasonsComponent', () => {
  let component: LocalBreaktimeReasonsComponent;
  let fixture: ComponentFixture<LocalBreaktimeReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocalBreaktimeReasonsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocalBreaktimeReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
