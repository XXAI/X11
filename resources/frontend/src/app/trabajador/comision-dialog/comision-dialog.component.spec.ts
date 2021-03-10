import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ComisionDialogComponent } from './comision-dialog.component';

describe('ComisionDialogComponent', () => {
  let component: ComisionDialogComponent;
  let fixture: ComponentFixture<ComisionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
