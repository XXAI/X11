import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogosRoutingModule } from './catalogos-routing.module';
import { CluesModule } from './clues/clues.module';
import { ProfesionesModule } from './profesiones/profesiones.module';
import { GruposModule } from './grupos/grupos.module';
import { CatalogosComponent } from './catalogos.component';


@NgModule({
  declarations: [CatalogosComponent],
  imports: [
    CommonModule,
    CatalogosRoutingModule
  ],
  exports:[
    CluesModule,
    ProfesionesModule,
    GruposModule
  ]
})
export class CatalogosModule { }
