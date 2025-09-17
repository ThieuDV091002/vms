import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNFCComponent } from './read-nfc.component';

describe('ReadNFCComponent', () => {
  let component: ReadNFCComponent;
  let fixture: ComponentFixture<ReadNFCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadNFCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReadNFCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
