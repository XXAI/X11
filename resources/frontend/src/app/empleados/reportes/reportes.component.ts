import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { EmpleadosService } from '../empleados.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor(private empleadosService: EmpleadosService) { }

  execQuery:string;
  dataSource:any[] = [];
  displayedColumns:string[] = [];
  pageSize:number = 20;
  currentPage:number = 0;
  resultsLength:number = 0;

  paginarResultados:boolean = false;

  ngOnInit() {
  }

  loadResultsData(event?:PageEvent){
    //
  }

  executeQuery(){
    this.empleadosService.ejecutarReporte({query: this.execQuery}).subscribe(
      response => {
        console.log(response);
        this.displayedColumns = response.columns;
      }
    );
  }

  downloadReport(){
    console.log(this.execQuery);
  }

}
