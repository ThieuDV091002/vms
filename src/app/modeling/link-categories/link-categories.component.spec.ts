import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCategoriesComponent } from './link-categories.component';

describe('LinkCategoriesComponent', () => {
  let component: LinkCategoriesComponent;
  let fixture: ComponentFixture<LinkCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
