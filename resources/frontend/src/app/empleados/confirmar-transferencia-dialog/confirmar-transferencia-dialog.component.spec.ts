import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmarTransferenciaDialogComponent } from './confirmar-transferencia-dialog.component';

describe('ConfirmarTransferenciaDialogComponent', () => {
  let component: ConfirmarTransferenciaDialogComponent;
  let fixture: ComponentFixture<ConfirmarTransferenciaDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmarTransferenciaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarTransferenciaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
