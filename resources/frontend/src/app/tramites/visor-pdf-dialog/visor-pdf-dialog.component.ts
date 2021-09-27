import { Component, OnInit, OnDestroy, Inject, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, NgModel, FormArray, FormControl } from '@angular/forms';
import { TramitesService } from '../tramites.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../shared/shared.service';

export interface VerTrabajadorData {
  render?: string;
}

@Component({
  selector: 'app-visor-pdf-dialog',
  templateUrl: './visor-pdf-dialog.component.html',
  styleUrls: ['./visor-pdf-dialog.component.css']
})
export class VisorPdfDialogComponent implements OnInit {

  url:string = "";

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<VisorPdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerTrabajadorData,
    public dialog: MatDialog,
    private apiService: TramitesService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    console.log(this.data);
    this.url = this.data.render;
  }

}
