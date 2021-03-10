import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransferenciaEmpleadoDialogComponent } from './transferencia-empleado-dialog.component';

describe('TransferenciaEmpleadoDialogComponent', () => {
  let component: TransferenciaEmpleadoDialogComponent;
  let fixture: ComponentFixture<TransferenciaEmpleadoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferenciaEmpleadoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaEmpleadoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
