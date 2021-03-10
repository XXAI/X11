import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarEmpleadoDialogComponent } from './agregar-empleado-dialog.component';

describe('AgregarEmpleadoDialogComponent', () => {
  let component: AgregarEmpleadoDialogComponent;
  let fixture: ComponentFixture<AgregarEmpleadoDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarEmpleadoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEmpleadoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
