import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AgregarFirmantesDialogComponent } from './agregar-firmantes-dialog.component';

describe('AgregarFirmantesDialogComponent', () => {
  let component: AgregarFirmantesDialogComponent;
  let fixture: ComponentFixture<AgregarFirmantesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarFirmantesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarFirmantesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
