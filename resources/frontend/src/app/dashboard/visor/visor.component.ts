import { Component, OnInit } from '@angular/core';
import { ClockService } from '../../utils/classes/clock.service';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';


declare var require: any;

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements OnInit {
  private subscription: Subscription = new Subscription();

  today:Date;
  myDashboard: any;
  isLoading: boolean;
  
  constructor(private clock:ClockService, private dashboardService:DashboardService) {
  
  }

  ngOnInit() {
   
    this.isLoading = true;
    this.dashboardService.obtenerDashboard().subscribe(
      response => {
        console.log(response);
        for(let i in response.data.items){
          if(response.data.items[i].type == 'data'){
            if(!isNaN(Number(response.data.items[i].data.title))){
              response.data.items[i].data.title_format = true;
            }
            if(!isNaN(Number(response.data.items[i].data.subtitle))){
              response.data.items[i].data.subtitle_format = true;
            }
          }else if (response.data.items[i].type == 'list'){
            for(let j in response.data.items[i].data){
              if(!isNaN(Number(response.data.items[i].data[j].title))){
                response.data.items[i].data[j].title_format = true;
              }
              if(!isNaN(Number(response.data.items[i].data[j].subtitle))){
                response.data.items[i].data[j].subtitle_format = true;
              }
            }
          }
        }
        this.myDashboard = response.data;
      }
    );
  }

  ngAfterViewInit(){
    
  }

  ngOnDestroy(){
    
  }
}
