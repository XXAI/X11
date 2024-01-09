import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrigadistaRoutingModule } from './brigadista-routing.module';
import { CapturistaComponent } from './capturista/capturista.component';
import { IndexComponent } from './index/index.component';

import { SharedModule } from '../shared/shared.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getEspPaginatorIntl } from '../esp-paginator-intl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { RegistroGeneralComponent } from './admin/registro-general/registro-general.component';
import { RegistroParticularComponent } from './admin/registro-particular/registro-particular.component';
import { ListadoComponent } from './admin/listado/listado.component';


@NgModule({
  declarations: [
    CapturistaComponent,
    IndexComponent,
    RegistroGeneralComponent,
    RegistroParticularComponent,
    ListadoComponent
  ],
  imports: [
    CommonModule,
    BrigadistaRoutingModule,
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
export class BrigadistaModule { }
