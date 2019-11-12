import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { ListaComponent } from './lista/lista.component';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { EditarComponent } from './editar/editar.component';
import { EstudiosDialogComponent } from './estudios-dialog/estudios-dialog.component';
import { TransferenciaEmpleadoDialogComponent } from './transferencia-empleado-dialog/transferencia-empleado-dialog.component';
import { ConfirmarTransferenciaDialogComponent } from './confirmar-transferencia-dialog/confirmar-transferencia-dialog.component';
import { EditarHorarioDialogComponent } from './editar-horario-dialog/editar-horario-dialog.component';

@NgModule({
  declarations: [ListaComponent, EditarComponent, EstudiosDialogComponent, TransferenciaEmpleadoDialogComponent, EditarHorarioDialogComponent, ConfirmarTransferenciaDialogComponent],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  entryComponents:[
    EstudiosDialogComponent,
    TransferenciaEmpleadoDialogComponent,
    ConfirmarTransferenciaDialogComponent,
    EditarHorarioDialogComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class EmpleadosModule { }
