import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableFooterComponent } from './datatable-footer.component';

describe('DatatableFooterComponent', () => {
  let component: DatatableFooterComponent;
  let fixture: ComponentFixture<DatatableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatatableFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DatatableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
