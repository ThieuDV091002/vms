import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuportTeamsComponent } from './suport-teams.component';

describe('SuportTeamsComponent', () => {
  let component: SuportTeamsComponent;
  let fixture: ComponentFixture<SuportTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuportTeamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuportTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
