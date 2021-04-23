import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferenciaTrabajadorDialogComponent } from './transferencia-trabajador-dialog.component';

describe('TransferenciaTrabajadorDialogComponent', () => {
  let component: TransferenciaTrabajadorDialogComponent;
  let fixture: ComponentFixture<TransferenciaTrabajadorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferenciaTrabajadorDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferenciaTrabajadorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
