import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateModelsComponent } from './state-models.component';

describe('StatesComponent', () => {
  let component: StateModelsComponent;
  let fixture: ComponentFixture<StateModelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateModelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
