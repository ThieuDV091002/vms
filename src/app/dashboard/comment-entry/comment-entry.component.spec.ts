import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentEntryComponent } from './comment-entry.component';

describe('CommentEntryComponent', () => {
  let component: CommentEntryComponent;
  let fixture: ComponentFixture<CommentEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
