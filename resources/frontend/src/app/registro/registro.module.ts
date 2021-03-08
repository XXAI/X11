import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { RegistroRoutingModule } from './registro-routing.module';
import { FormularioComponent } from './formulario/formulario.component';

import { SharedModule } from '../shared/shared.module';
import { MatPaginatorIntl, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE  } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { ConfirmActionDialogComponent } from '../utils/confirm-action-dialog/confirm-action-dialog.component';
import { ConfirmPasswordDialogComponent } from './confirm-password-dialog/confirm-password-dialog.component';

@NgModule({
  declarations: [FormularioComponent, ConfirmPasswordDialogComponent],
  imports: [
    CommonModule,
    RegistroRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents:[
    ConfirmPasswordDialogComponent,
    //ConfirmActionDialogComponent
  ]
})
export class RegistroModule { }
