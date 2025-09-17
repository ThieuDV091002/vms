import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTeamPageComponent } from './support-team-page.component';

describe('SupportTeamPageComponent', () => {
  let component: SupportTeamPageComponent;
  let fixture: ComponentFixture<SupportTeamPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportTeamPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportTeamPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
