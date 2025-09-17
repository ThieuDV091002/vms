import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerLevelsComponent } from './container-levels.component';

describe('ContainerLevelsComponent', () => {
  let component: ContainerLevelsComponent;
  let fixture: ComponentFixture<ContainerLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerLevelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContainerLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

