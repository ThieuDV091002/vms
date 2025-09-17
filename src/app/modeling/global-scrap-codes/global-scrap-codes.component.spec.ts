import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalScrapCodesComponent } from './global-scrap-codes.component';

describe('GlobalScrapCodesComponent', () => {
  let component: GlobalScrapCodesComponent;
  let fixture: ComponentFixture<GlobalScrapCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalScrapCodesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalScrapCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
