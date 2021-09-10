import { Component, OnInit, Input, Inject } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TramitesService } from '../tramites.service';
import { HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface VerTrabajadorData {
  id?: string;
  rfc?:string;
}

@Component({
  selector: 'app-documentacion-importacion-dialog',
  templateUrl: './documentacion-importacion-dialog.component.html',
  styleUrls: ['./documentacion-importacion-dialog.component.css']
})
export class DocumentacionImportacionDialogComponent implements OnInit {
  @Input() requiredFileType:string;

    fileName = '';
    file:File;
    submitted = false;
    form = this.fb.group({
      'file': []
    });
    
    constructor(
    private sharedService: SharedService,
    public dialogRef: MatDialogRef<DocumentacionImportacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerTrabajadorData,
    public tramitesService: TramitesService,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
  }
  onFileSelected(event) {
    
  }
      
     
  uploadFile(event) {
    this.file = event.target.files[0];
    console.log(this.file);
    if (this.file) {
      if(this.file.size > 52429000)
      {
        this.sharedService.showSnackBar("El archivo es mayor a 5Mb", null, 3000);
        this.file = null;
        return;
      }
      if(this.file.type != "application/pdf")
      {
        this.sharedService.showSnackBar("El archivo no es un pdf, verifique por favor", null, 3000);
        this.file = null;
        return;
      }
      this.fileName = this.file.name;
    }
  /*  if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        fileSource: file
      });
    }*/
  }
     
  onSubmit(){
    const formData: FormData = new FormData();

    formData.append('archivo', this.file, this.file.name);
    formData.append('rfc', this.data.rfc);
    formData.append('id', this.data.id);
   
    this.tramitesService.setUploadFile(formData).subscribe(
      response =>{
        console.log(response);
      
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      
      }
    );
    
  }
 
  cancelar(): void {
    this.dialogRef.close(false);
  }
}
