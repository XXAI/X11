import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DirectorioRoutingModule } from './directorio-routing.module';
import { ListaComponent } from './lista/lista.component';
import { VerComponent } from './ver/ver.component';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { AgregarPersonalComponent } from './agregar-personal/agregar-personal.component';

@NgModule({
  declarations: [
    ListaComponent,
    VerComponent,
    AgregarPersonalComponent,
  ],
  imports: [
    CommonModule,
    DirectorioRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  entryComponents:[
    VerComponent,
    AgregarPersonalComponent
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class DirectorioModule { }
