import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommentDataComponent } from './add-comment-data.component';

describe('AddCommentDataComponent', () => {
  let component: AddCommentDataComponent;
  let fixture: ComponentFixture<AddCommentDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommentDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCommentDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
