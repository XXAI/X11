import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { ListaComponent } from './prestamos/lista/lista.component';
import { FormularioComponent } from './prestamos/formulario/formulario.component';

const routes: Routes = [
  { path: 'expedientes', component: ListaComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpedienteRoutingModule { }
