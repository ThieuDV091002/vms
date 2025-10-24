import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaladminComponent } from './localadmin.component';

describe('LocaladminComponent', () => {
  let component: LocaladminComponent;
  let fixture: ComponentFixture<LocaladminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocaladminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocaladminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
