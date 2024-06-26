import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CluesRoutingModule } from './clues-routing.module';
import { ListaComponent } from './lista/lista.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';
import { EditarComponent } from './editar/editar.component';
import { NuevoComponent } from './nuevo/nuevo.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [ListaComponent, EditarComponent, NuevoComponent],
  imports: [
    CommonModule,
    SharedModule,
    CluesRoutingModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    BrowserAnimationsModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class CluesModule { }
