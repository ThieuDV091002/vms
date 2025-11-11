import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageLinkComponent } from './imagelink.component';

describe('ImagelinkComponent', () => {
  let component: ImageLinkComponent;
  let fixture: ComponentFixture<ImageLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageLinkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
