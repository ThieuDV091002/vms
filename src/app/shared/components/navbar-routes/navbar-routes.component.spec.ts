import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarRoutesComponent } from './navbar-routes.component';

describe('NavbarRoutesComponent', () => {
  let component: NavbarRoutesComponent;
  let fixture: ComponentFixture<NavbarRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarRoutesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
