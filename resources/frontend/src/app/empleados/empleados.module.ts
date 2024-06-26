import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { ListaComponent } from './lista/lista.component';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { EditarComponent } from './editar/editar.component';
import { EstudiosDialogComponent } from './estudios-dialog/estudios-dialog.component';
import { TransferenciaEmpleadoDialogComponent } from './transferencia-empleado-dialog/transferencia-empleado-dialog.component';
import { ConfirmarTransferenciaDialogComponent } from './confirmar-transferencia-dialog/confirmar-transferencia-dialog.component';
import { EditarHorarioDialogComponent } from './editar-horario-dialog/editar-horario-dialog.component';
import { AgregarEmpleadoDialogComponent } from './agregar-empleado-dialog/agregar-empleado-dialog.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { BajaDialogComponent } from './baja-dialog/baja-dialog.component';
import { AgregarFirmantesDialogComponent } from './agregar-firmantes-dialog/agregar-firmantes-dialog.component';
import { VerComponent } from './ver/ver.component';


@NgModule({
  declarations: [ListaComponent, EditarComponent, EstudiosDialogComponent, TransferenciaEmpleadoDialogComponent, EditarHorarioDialogComponent, ConfirmarTransferenciaDialogComponent, AgregarEmpleadoDialogComponent, NuevoComponent, BajaDialogComponent, AgregarFirmantesDialogComponent, VerComponent],
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
    AgregarEmpleadoDialogComponent,
    EditarHorarioDialogComponent,
    BajaDialogComponent,
    AgregarFirmantesDialogComponent,
    VerComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class EmpleadosModule { }
