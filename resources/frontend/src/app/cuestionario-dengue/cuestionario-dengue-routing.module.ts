import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CuestionarioComponent } from './cuestionario/cuestionario.component';


const routes: Routes = [
  { path: 'cuestionario-dengue', component: CuestionarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuestionarioDengueRoutingModule { }
