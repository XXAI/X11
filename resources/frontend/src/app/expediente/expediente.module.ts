import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpedienteRoutingModule } from './expediente-routing.module';
import { ListaComponent } from './prestamos/lista/lista.component';
import { FormularioComponent } from './prestamos/formulario/formulario.component';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';

@NgModule({
  declarations: [
    ListaComponent,
    FormularioComponent
  ],
  imports: [
    CommonModule,
    ExpedienteRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class ExpedienteModule { }
