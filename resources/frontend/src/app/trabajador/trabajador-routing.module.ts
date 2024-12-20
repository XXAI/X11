import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';

import { VerComponent } from './ver/ver.component';

const routes: Routes = [
  { path: 'trabajadores', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'trabajadores/nuevo', component: FormularioComponent, canActivate: [AuthGuard] },
  { path: 'trabajadores/editar/:id', component: FormularioComponent, canActivate: [AuthGuard] },
  { path: 'trabajadores/editar/:id/:step', component: FormularioComponent, canActivate: [AuthGuard] },

  { path: 'trabajadores/ver/:id', component: VerComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajadorRoutingModule { }
