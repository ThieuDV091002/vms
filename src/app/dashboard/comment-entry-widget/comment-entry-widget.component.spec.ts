import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentEntryWidgetComponent } from './comment-entry-widget.component';

describe('CommentEntryWidgetComponent', () => {
  let component: CommentEntryWidgetComponent;
  let fixture: ComponentFixture<CommentEntryWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentEntryWidgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommentEntryWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
