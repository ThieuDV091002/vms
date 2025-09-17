import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLabelsComponent } from './user-labels.component';

describe('UserLabelsComponent', () => {
  let component: UserLabelsComponent;
  let fixture: ComponentFixture<UserLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLabelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
