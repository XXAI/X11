import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInformacionDialogComponent } from './ver-informacion-dialog.component';

describe('VerInformacionDialogComponent', () => {
  let component: VerInformacionDialogComponent;
  let fixture: ComponentFixture<VerInformacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerInformacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerInformacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
