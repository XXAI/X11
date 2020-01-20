import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { CluesModule } from './clues/clues.module';
import { ProfesionesModule } from './profesiones/profesiones.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CatalogosRoutingModule
  ],
  exports:[
    CluesModule,
    ProfesionesModule
  ]
})
export class CatalogosModule { }
