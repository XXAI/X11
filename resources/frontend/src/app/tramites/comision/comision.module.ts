import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComisionRoutingModule } from './comision-routing.module';
import { ListaComponent } from './lista/lista.component';
import { MatStepperModule } from '@angular/material/stepper';
import { FormularioComponent } from './formulario/formulario.component';
import { ImportarComponent } from './importar/importar.component';
import { BuscadorComponent } from './buscador/buscador.component';


@NgModule({
  declarations: [ListaComponent, FormularioComponent, ImportarComponent, BuscadorComponent],
  imports: [
    CommonModule,
    ComisionRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class ComisionModule { }
