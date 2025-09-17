import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusedItemsComponent } from './focused-tiems.component';

describe('StateComponent', () => {
  let component: FocusedItemsComponent;
  let fixture: ComponentFixture<FocusedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FocusedItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FocusedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
