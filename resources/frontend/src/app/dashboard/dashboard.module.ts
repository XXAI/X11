import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { VisorComponent } from './visor/visor.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [VisorComponent, ConfiguracionComponent],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
