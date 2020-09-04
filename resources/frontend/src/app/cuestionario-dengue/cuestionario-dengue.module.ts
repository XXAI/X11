import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { CuestionarioDengueRoutingModule } from './cuestionario-dengue-routing.module';
import { CuestionarioComponent } from './cuestionario/cuestionario.component';
import { InstruccionesComponent } from './instrucciones/instrucciones.component';


@NgModule({
  declarations: [CuestionarioComponent, InstruccionesComponent],
  imports: [
    CommonModule,
    CuestionarioDengueRoutingModule,
    SharedModule
  ],entryComponents: [
    InstruccionesComponent
  ]

})
export class CuestionarioDengueModule { }
