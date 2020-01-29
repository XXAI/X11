import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruposRoutingModule } from './grupos-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';

import { MatPaginatorIntl } from '@angular/material';
import { getEspPaginatorIntl } from '../../esp-paginator-intl';

@NgModule({
  declarations: [ListaComponent, FormularioComponent],
  imports: [
    CommonModule,
    SharedModule,
    GruposRoutingModule
  ],
  entryComponents:[
    FormularioComponent,
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class GruposModule { }
