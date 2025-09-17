import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastMessageEntryComponent } from './broadcast-message-entry.component';

describe('BroadcastMessageEntryComponent', () => {
  let component: BroadcastMessageEntryComponent;
  let fixture: ComponentFixture<BroadcastMessageEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcastMessageEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BroadcastMessageEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
