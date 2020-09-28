import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrabajadorRoutingModule } from './trabajador-routing.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { JornadaDialogComponent } from './jornada-dialog/jornada-dialog.component';
import { EstudiosDialogComponent } from './estudios-dialog/estudios-dialog.component';
import { CapacitacionDialogComponent } from './capacitacion-dialog/capacitacion-dialog.component';


@NgModule({
  declarations: [ListaComponent, FormularioComponent, JornadaDialogComponent, EstudiosDialogComponent, CapacitacionDialogComponent],
  imports: [
    CommonModule,
    TrabajadorRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  entryComponents:[
    JornadaDialogComponent,
    EstudiosDialogComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class TrabajadorModule { }
