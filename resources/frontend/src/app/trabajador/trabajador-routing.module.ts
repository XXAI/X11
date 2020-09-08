import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ListaComponent } from './lista/lista.component';
import { FormularioComponent } from './formulario/formulario.component';



const routes: Routes = [
  { path: 'trabajadores', component: ListaComponent, canActivate: [AuthGuard] },
  { path: 'trabajadores/nuevo', component: FormularioComponent, canActivate: [AuthGuard] },
  { path: 'trabajadores/editar/:id', component: FormularioComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrabajadorRoutingModule { }
