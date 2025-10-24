import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagelinkComponent } from './imagelink.component';

describe('ImagelinkComponent', () => {
  let component: ImagelinkComponent;
  let fixture: ComponentFixture<ImagelinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagelinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImagelinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
