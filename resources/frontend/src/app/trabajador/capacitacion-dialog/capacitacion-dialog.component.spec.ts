import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacitacionDialogComponent } from './capacitacion-dialog.component';

describe('CapacitacionDialogComponent', () => {
  let component: CapacitacionDialogComponent;
  let fixture: ComponentFixture<CapacitacionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacitacionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacitacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
