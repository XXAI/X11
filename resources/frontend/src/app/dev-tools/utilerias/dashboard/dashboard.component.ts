import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DbDialogComponent } from '../db-dialog/db-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('buttonInOut', [
        transition('void => *', [
            style({opacity: '1'}),
            animate(200)
        ]),
        transition('* => void', [
            animate(200, style({opacity: '0'}))
        ])
    ])
  ],
})
export class DashboardComponent implements OnInit {

  mediaSize: string;

  constructor(private sharedService: SharedService,public dialog: MatDialog, ) { }

  ngOnInit(): void {
  }
  public ImportarDB() {
    let configDialog = {};
    let row: any = {};
    if (this.mediaSize == 'lg') {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '800px',
        width: '100%',
        data: row
      }
    } else if (this.mediaSize == "md") {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data: row
      }
    } else if (this.mediaSize == 'xs') {
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '72%',
        width: '100%',
        data: row
      };
    } else {
      configDialog = {
        width: '60%',
        maxHeight: '100vh',
        height: '580px',
        data: row
      }
    }
    console.log("hola");
    
    const dialogRef = this.dialog.open(DbDialogComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        //this.loadTrabajadorData();
      }
    });
  }
  
}
