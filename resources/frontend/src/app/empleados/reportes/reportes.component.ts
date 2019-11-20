import { Component, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  constructor() { }

  dataSource:any[] = [];
  displayedColumns:string[] = [];
  pageSize:number = 0;
  currentPage:number = 0;
  resultsLength:number = 0;

  paginarResultados:boolean = false;

  ngOnInit() {
  }

  loadResultsData(event?:PageEvent){
    //
  }

}
