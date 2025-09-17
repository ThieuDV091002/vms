import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaHuddleQnTableComponent } from './area-huddle-qn-table.component';

describe('AreaHuddleQnTableComponent', () => {
  let component: AreaHuddleQnTableComponent;
  let fixture: ComponentFixture<AreaHuddleQnTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaHuddleQnTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaHuddleQnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
