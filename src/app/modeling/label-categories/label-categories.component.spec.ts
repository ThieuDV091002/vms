import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelCategoriesComponent } from './label-categories.component';

describe('LabelCategoriesComponent', () => {
  let component: LabelCategoriesComponent;
  let fixture: ComponentFixture<LabelCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabelCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
