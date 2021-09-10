import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentacionImportacionDialogComponent } from './documentacion-importacion-dialog.component';

describe('DocumentacionImportacionDialogComponent', () => {
  let component: DocumentacionImportacionDialogComponent;
  let fixture: ComponentFixture<DocumentacionImportacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentacionImportacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentacionImportacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
