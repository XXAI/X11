import { Component, OnInit } from '@angular/core';
import { AppsListService } from './apps-list.service';
import { App } from './apps';
import { AvisosComponent } from './avisos/avisos.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-apps-list',
  templateUrl: './apps-list.component.html',
  styleUrls: ['./apps-list.component.css']
})
export class AppsListComponent implements OnInit {

  apps: App[];
  breakpoint = 6;
  mediaSize:string;

  constructor(private appsService: AppsListService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getApps();
    this.breakpoint = (window.innerWidth <= 599) ? 3 : 6;
    this.setAvisos();
  }

  getApps():void{
    this.apps = this.appsService.getApps();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 3 : 6;
  }

  setAvisos()
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{}
      };
    }else{
      configDialog = {
        width: '60%',
        height: '850px',
        maxWidth: '100vw',
        maxHeight: '62vh',
        data:{}
      }
    }

    //console.log(configDialog);

    const dialogRef = this.dialog.open(AvisosComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
  }

}
