import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from './users.service';
import { SharedService } from '../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { ConfirmActionDialogComponent } from '../utils/confirm-action-dialog/confirm-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  isLoading: boolean = false;

  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;

  displayedColumns: string[] = ['id','state','username','name','email','actions'];
  dataSource: any = [];
  
  constructor(private sharedService: SharedService, private usersService: UsersService, public dialog: MatDialog) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;

  ngOnInit() {
    this.loadUsersData(null);
  }

  public loadUsersData(event?:PageEvent){
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

    this.usersService.getUserList(params).subscribe(
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
    this.loadUsersData(null);
  }

  confirmDeleteUser(id):void {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Eliminar Usuario',dialogMessage:'Esta seguro de eliminar este usuario?',btnColor:'warn',btnText:'Eliminar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.usersService.deleteUser(id).subscribe(
          response =>{
            this.loadUsersData(this.pageEvent);
          }
        );
      }
    });
  }

  activar(id):void{
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Activar Usuario',dialogMessage:'Esta seguro de activar este usuario? Escriba ACTIVAR para confirmar la activación',validationString:'ACTIVAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.usersService.status(id,{proceso:1}).subscribe(
          response =>{
            this.loadUsersData(this.pageEvent);
          }
        );
      }
    });
  }
  suspender(id):void{
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'Suspender Usuario',dialogMessage:'Esta seguro de suspender este usuario? Escriba SUSPENDER para confirmar la suspensión',validationString:'SUSPENDER',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.usersService.status(id,{proceso:2}).subscribe(
          response =>{
            this.loadUsersData(this.pageEvent);
          }
        );
      }
    });
  }
}