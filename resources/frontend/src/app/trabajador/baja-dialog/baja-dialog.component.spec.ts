import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BajaDialogComponent } from './baja-dialog.component';

describe('BajaDialogComponent', () => {
  let component: BajaDialogComponent;
  let fixture: ComponentFixture<BajaDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BajaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BajaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
