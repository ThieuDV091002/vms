import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherCountry } from './other-country';

describe('OtherCountry', () => {
  let component: OtherCountry;
  let fixture: ComponentFixture<OtherCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherCountry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherCountry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
