import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { InicioComponent } from './inicio/inicio.component';
import { DocumentacionComponent } from './documentacion/documentacion.component';


const routes: Routes = [
  { path: 'tramites', component: InicioComponent, canActivate: [AuthGuard] },
  //{ path: 'tramites/comision', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'tramites/documentacion', component: DocumentacionComponent, canActivate: [AuthGuard] },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TramitesRoutingModule { }
