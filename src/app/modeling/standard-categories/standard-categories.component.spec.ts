import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardCategoriesComponent } from './standard-categories.component';

describe('StandardCategoriesComponent', () => {
  let component: StandardCategoriesComponent;
  let fixture: ComponentFixture<StandardCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StandardCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
