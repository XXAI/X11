import { Component, OnInit, ViewChild } from '@angular/core';
import { DirectorioService } from '../directorio.service';
import { SharedService } from '../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
//import { ConfirmActionDialogComponent } from '../utils/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MediaObserver } from '@angular/flex-layout';
import { VerComponent } from '../ver/ver.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  isLoading: boolean = false;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  mediaSize: string;

  displayedColumns: string[] = ['nombre_unidad','responsable','humanos','administracion','actions'];
  dataSource: any = [];
  
  constructor(private sharedService: SharedService, private directorioService: DirectorioService, public dialog: MatDialog, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;

  ngOnInit() {
    this.loadDirectorioData(null);
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });
  }

  public loadDirectorioData(event?:PageEvent){
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: 20 }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    params.query = this.searchQuery;

    this.directorioService.getDirectorioList(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          this.dataSource = [];
          this.resultsLength = 0;
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  applyFilter(){
    this.paginator.pageIndex = 0;
    this.loadDirectorioData(null);
  }

  EditarCR(cr)
  {
    console.log(cr);
    let paginator = this.sharedService.getDataFromCurrentApp('paginator');
    this.sharedService.setDataToCurrentApp('paginator',paginator);

    let configDialog = {};
    /*if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{cr: cr, scSize:this.mediaSize}
      };
    }else{*/
      configDialog = {
        width: '50%',
        maxHeight: '50vh',
        height: '643px',
        data:{CR: cr}
      }
    //}

    const dialogRef = this.dialog.open(VerComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
        this.loadDirectorioData(null);
      }else{
        console.log('Cancelar');
      }
    });
  }
}
