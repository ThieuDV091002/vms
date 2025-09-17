import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileCardCreatorComponent } from './mobile-card-creator.component';

describe('MobileCardCreatorComponent', () => {
  let component: MobileCardCreatorComponent;
  let fixture: ComponentFixture<MobileCardCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileCardCreatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileCardCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
