import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCategoriesComponent } from './message-categories.component';

describe('MessageCategoriesComponent', () => {
  let component: MessageCategoriesComponent;
  let fixture: ComponentFixture<MessageCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MessageCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
