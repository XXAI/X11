import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComisionSindicalRoutingModule } from './comision-sindical-routing.module';
import { ListaComponent } from './lista/lista.component';
import { AgregarDialogComponent } from './agregar-dialog/agregar-dialog.component';

import { SharedModule } from '../../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ListaComponent, AgregarDialogComponent],
  imports: [
    CommonModule,
    ComisionSindicalRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class ComisionSindicalModule { }
