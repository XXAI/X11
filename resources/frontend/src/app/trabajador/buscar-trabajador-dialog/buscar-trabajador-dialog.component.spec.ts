import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarTrabajadorDialogComponent } from './buscar-trabajador-dialog.component';

describe('BuscarTrabajadorDialogComponent', () => {
  let component: BuscarTrabajadorDialogComponent;
  let fixture: ComponentFixture<BuscarTrabajadorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuscarTrabajadorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarTrabajadorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
