import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { ListaComponent } from './lista/lista.component';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { EditarComponent } from './editar/editar.component';
import { EstudiosDialogComponent } from './estudios-dialog/estudios-dialog.component';
import { TransferenciaEmpleadoDialogComponent } from './transferencia-empleado-dialog/transferencia-empleado-dialog.component';
import { EditarHorarioDialogComponent } from './editar-horario-dialog/editar-horario-dialog.component';

@NgModule({
  declarations: [ListaComponent, EditarComponent, EstudiosDialogComponent, TransferenciaEmpleadoDialogComponent, EditarHorarioDialogComponent],
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
    EditarHorarioDialogComponent
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class EmpleadosModule { }
