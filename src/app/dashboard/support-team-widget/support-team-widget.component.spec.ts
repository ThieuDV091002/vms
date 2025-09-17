import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTeamWidgetComponent } from './support-team-widget.component';

describe('SupportTeamWidgetComponent', () => {
  let component: SupportTeamWidgetComponent;
  let fixture: ComponentFixture<SupportTeamWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportTeamWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportTeamWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
