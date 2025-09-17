import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentDisplayWidgetComponent } from './comment-display-widget.component';

describe('CommentDisplayWidgetComponent', () => {
  let component: CommentDisplayWidgetComponent;
  let fixture: ComponentFixture<CommentDisplayWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentDisplayWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentDisplayWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
