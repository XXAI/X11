import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListaComponent } from './lista/lista.component';
//import { EditarComponent } from './editar/editar.component';
import { AuthGuard } from '../../auth/auth.guard';

const routes: Routes = [
  { path: 'credencializacion/salud', component: ListaComponent, canActivate: [AuthGuard] },
  //{ path: 'catalogos/clues/editar/:id', component: EditarComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaludRoutingModule { }
