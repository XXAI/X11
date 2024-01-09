import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListadoComponent } from './admin/listado/listado.component';
import { CapturistaComponent } from './capturista/capturista.component';
import { IndexComponent } from './index/index.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'brigadista', component: IndexComponent, canActivate: [AuthGuard] },
  { path: 'brigadista/registro', component: ListadoComponent, canActivate: [AuthGuard] },
  { path: 'brigadista/capturista', component: CapturistaComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrigadistaRoutingModule { }
