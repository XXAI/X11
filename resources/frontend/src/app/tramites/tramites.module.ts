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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CancelarDocumentacionDialogComponent } from './cancelar-documentacion-dialog/cancelar-documentacion-dialog.component';
import { VerInformacionDialogComponent } from './ver-informacion-dialog/ver-informacion-dialog.component';
import { VisorPdfDialogComponent } from './visor-pdf-dialog/visor-pdf-dialog.component';

import { AdscripcionModule } from './adscripcion/adscripcion.module';
import { ReincorporacionModule } from './reincorporacion/reincorporacion.module';

@NgModule({
  declarations: [ListaComponent, DocumentacionComponent, DocumentacionImportacionDialogComponent, CancelarDocumentacionDialogComponent, VerInformacionDialogComponent, VisorPdfDialogComponent/*, FormatoFechaPipe*/],
  imports: [
    CommonModule,
    TramitesRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AdscripcionModule,
    ReincorporacionModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ],
  entryComponents:[
    DocumentacionImportacionDialogComponent,
    CancelarDocumentacionDialogComponent,
    VerInformacionDialogComponent,
    VisorPdfDialogComponent
  ]
})
export class TramitesModule { }
