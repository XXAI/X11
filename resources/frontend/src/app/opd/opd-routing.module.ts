import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListadoComponent } from './listado/listado.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'opd', component: ListadoComponent/*, canActivate: [AuthGuard]*/ },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpdRoutingModule { }
