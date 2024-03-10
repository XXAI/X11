import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpdRoutingModule } from './opd-routing.module';
import { ListadoComponent } from './listado/listado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';


@NgModule({
  declarations: [
    ListadoComponent
  ],
  imports: [
    CommonModule,
    OpdRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class OpdModule { }
