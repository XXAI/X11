import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { HttpClient } from '@angular/common/http';

//import { FormatoFechaPipe } from '../utils/classes/fecha/formato-fecha.pipe'

import { TramitesRoutingModule } from './tramites-routing.module';
import { ListaComponent } from './lista/lista.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';
import { DocumentacionImportacionDialogComponent } from './documentacion-importacion-dialog/documentacion-importacion-dialog.component';

import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

@NgModule({
  declarations: [ListaComponent, DocumentacionComponent, DocumentacionImportacionDialogComponent/*, FormatoFechaPipe*/],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ],
  entryComponents:[
    DocumentacionImportacionDialogComponent
  ]
})
export class TramitesModule { }
