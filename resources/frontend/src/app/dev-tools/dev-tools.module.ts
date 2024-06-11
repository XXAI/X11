import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DevToolsRoutingModule } from './dev-tools-routing.module';
import { ReporterModule } from './reporter/reporter.module';
import { DashboardComponent } from './utilerias/dashboard/dashboard.component';
import { DbDialogComponent } from './utilerias/db-dialog/db-dialog.component';
import { PrincipalComponent } from './utilerias/principal/principal.component';
import { ImportacionComponent } from './utilerias/importacion/importacion.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DbDialogComponent,
    PrincipalComponent,
    ImportacionComponent
  ],
  imports: [
    CommonModule,
    DevToolsRoutingModule,
    SharedModule,
  ],
  exports:[
    ReporterModule
  ]
})
export class DevToolsModule { }
