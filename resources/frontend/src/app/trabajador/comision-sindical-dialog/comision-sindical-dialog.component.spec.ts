import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionSindicalDialogComponent } from './comision-sindical-dialog.component';

describe('ComisionSindicalDialogComponent', () => {
  let component: ComisionSindicalDialogComponent;
  let fixture: ComponentFixture<ComisionSindicalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComisionSindicalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionSindicalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
