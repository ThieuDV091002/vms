import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQueriesComponent } from './user-queries.component';

describe('UserQueriesComponent', () => {
  let component: UserQueriesComponent;
  let fixture: ComponentFixture<UserQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserQueriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
