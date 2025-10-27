import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInformation } from './other-information';

describe('OtherInformation', () => {
  let component: OtherInformation;
  let fixture: ComponentFixture<OtherInformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherInformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherInformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
