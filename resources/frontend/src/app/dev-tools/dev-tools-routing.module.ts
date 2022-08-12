import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { DashboardComponent } from './utilerias/dashboard/dashboard.component';

const routes: Routes = [
  {path:'dev-tools', redirectTo:'dev-tools/mysql-reportes',pathMatch:'full'},
  { path: 'dev-tools/utilerias', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevToolsRoutingModule { }
