import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajadorRoutingModule } from './trabajador-routing.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { JornadaDialogComponent } from './jornada-dialog/jornada-dialog.component';
import { EstudiosDialogComponent } from './estudios-dialog/estudios-dialog.component';
import { CapacitacionDialogComponent } from './capacitacion-dialog/capacitacion-dialog.component';
import { BajaDialogComponent } from './baja-dialog/baja-dialog.component';
import { ComisionDialogComponent } from './comision-dialog/comision-dialog.component';

import { FormatoFechaPipe } from '../utils/classes/fecha/formato-fecha.pipe'
import { VerComponent } from './ver/ver.component';
import { BuscarTrabajadorDialogComponent } from './buscar-trabajador-dialog/buscar-trabajador-dialog.component';
import { AgregarFirmantesDialogComponent } from './agregar-firmantes-dialog/agregar-firmantes-dialog.component';
import { TransferenciaTrabajadorDialogComponent } from './transferencia-trabajador-dialog/transferencia-trabajador-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComisionSindicalDialogComponent } from './comision-sindical-dialog/comision-sindical-dialog.component';


@NgModule({
  declarations: [
    ListaComponent,
    FormularioComponent,
    JornadaDialogComponent,
    EstudiosDialogComponent,
    CapacitacionDialogComponent,
    BajaDialogComponent,
    ComisionDialogComponent,
    FormatoFechaPipe,
    VerComponent,
    BuscarTrabajadorDialogComponent,
    AgregarFirmantesDialogComponent,
    TransferenciaTrabajadorDialogComponent,
    ComisionSindicalDialogComponent
  ],
  imports: [
    CommonModule,
    TrabajadorRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    FormsModule
  ],
  entryComponents:[
    JornadaDialogComponent,
    EstudiosDialogComponent,
    CapacitacionDialogComponent,
    BajaDialogComponent, 
    ComisionDialogComponent,
    VerComponent,
    BuscarTrabajadorDialogComponent,
    AgregarFirmantesDialogComponent,
    TransferenciaTrabajadorDialogComponent,
    ComisionSindicalDialogComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class TrabajadorModule { }