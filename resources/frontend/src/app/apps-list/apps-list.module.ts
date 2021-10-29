import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppsListRoutingModule } from './apps-list-routing.module';
import { AppsListComponent } from './apps-list.component';
import { SharedModule } from '../shared/shared.module';
import { AvisosComponent } from './avisos/avisos.component';


@NgModule({
  declarations: [AppsListComponent, AvisosComponent],
  imports: [
    CommonModule,
    AppsListRoutingModule,
    SharedModule
  ],
  entryComponents:[
    AvisosComponent
  ]
})
export class AppsListModule { }
