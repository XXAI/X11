import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AppsListModule } from './apps-list/apps-list.module';

import { AppRoutingModule } from './app-routing.module';
import { WildcardRoutingModule } from './wildcard-routing.module';

import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { DrawerListComponent } from './navigation/drawer-list/drawer-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';

import { SharedService } from './shared/shared.service';
import { TokenInterceptor, ErrorInterceptor } from './token.service';
import { MatStepperModule } from '@angular/material/stepper';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';


import { SecurityModule } from './security/security.module';
import { ProfileModule } from './profile/profile.module';
import { DevToolsModule } from './dev-tools/dev-tools.module';
import { CatalogosModule } from './catalogos/catalogos.module';

//Modulos del Sistema
import { EmpleadosModule } from './empleados/empleados.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SelectorCrDialogComponent } from './utils/selector-cr-dialog/selector-cr-dialog.component';

//Cuestionario solo por un tiempo
//import { CuestionarioDengueModule } from './cuestionario-dengue/cuestionario-dengue.module';

//Modulos Nuevos
import { TrabajadorModule } from './trabajador/trabajador.module';
import { TramitesModule } from './tramites/tramites.module';
import { RegistroModule } from './registro/registro.module';
import { DirectorioModule } from './directorio/directorio.module';
import { CredencializacionModule } from './credencializacion/credencializacion.module';
import { ComisionSindicalModule } from './tramites/comision-sindical/comision-sindical.module';
import { ExpedienteModule } from './expediente/expediente.module';
import { BrigadistaModule } from './brigadista/brigadista.module';
import { OpdModule } from './opd/opd.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    WelcomeComponent,
    NotFoundComponent,
    DrawerListComponent,
    ForbiddenComponent,
    SelectorCrDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    AppsListModule,
    UsersModule,
    //EmpleadosModule,
    TrabajadorModule,
    TramitesModule,
    RegistroModule,
    DirectorioModule,
    DashboardModule,
    SecurityModule,
    DevToolsModule,
    CatalogosModule,
    ProfileModule,
    AppRoutingModule,
    ExpedienteModule,
    CredencializacionModule,
    BrigadistaModule,
    ComisionSindicalModule,
    OpdModule,
    WildcardRoutingModule,
  ],
  providers: [
    AuthService, 
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: MatStepperModule,
      useValue: { showError: true }
    },
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
