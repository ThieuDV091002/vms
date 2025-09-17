import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamingRulesComponent } from './naming-rules.component';

describe('NamingRulesComponent', () => {
  let component: NamingRulesComponent;
  let fixture: ComponentFixture<NamingRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamingRulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NamingRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
