import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpleadosRoutingModule } from './empleados-routing.module';
import { ListaComponent } from './lista/lista.component';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule  } from '@angular/material';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { EditarComponent } from './editar/editar.component';

@NgModule({
  declarations: [ListaComponent, EditarComponent],
  imports: [
    CommonModule,
    EmpleadosRoutingModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule 
  ],
  providers:[
    { provide: MatPaginatorIntl, useValue: getEspPaginatorIntl() }
  ]
})
export class EmpleadosModule { }
