import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelarDocumentacionDialogComponent } from './cancelar-documentacion-dialog.component';

describe('CancelarDocumentacionDialogComponent', () => {
  let component: CancelarDocumentacionDialogComponent;
  let fixture: ComponentFixture<CancelarDocumentacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelarDocumentacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelarDocumentacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
