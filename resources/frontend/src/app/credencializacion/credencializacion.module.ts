import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CredencializacionRoutingModule } from './credencializacion-routing.module';

import { SaludModule } from './salud/salud.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CredencializacionRoutingModule
  ],
  exports:[
    SaludModule
  ]
})
export class CredencializacionModule { }
