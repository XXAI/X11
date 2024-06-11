import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { DashboardComponent } from './utilerias/dashboard/dashboard.component';
import { PrincipalComponent } from './utilerias/principal/principal.component';
import { ImportacionComponent } from './utilerias/importacion/importacion.component';

const routes: Routes = [
  /*{path:'dev-tools', redirectTo:'dev-tools/mysql-reportes',pathMatch:'full'},*/
  { path: 'dev-tools', component: PrincipalComponent, canActivate: [AuthGuard]},
  { path: 'dev-tools/utilerias', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dev-tools/nomina', component: ImportacionComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevToolsRoutingModule { }
