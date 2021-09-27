import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorPdfDialogComponent } from './visor-pdf-dialog.component';

describe('VisorPdfDialogComponent', () => {
  let component: VisorPdfDialogComponent;
  let fixture: ComponentFixture<VisorPdfDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisorPdfDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorPdfDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
