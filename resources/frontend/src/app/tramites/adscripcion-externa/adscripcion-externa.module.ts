import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdscripcionExternaRoutingModule } from './adscripcion-externa-routing.module';
import { ListaComponent } from './lista/lista.component';


@NgModule({
  declarations: [ListaComponent],
  imports: [
    CommonModule,
    AdscripcionExternaRoutingModule,
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
export class AdscripcionExternaModule { }
