import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbDialogComponent } from './db-dialog.component';

describe('DbDialogComponent', () => {
  let component: DbDialogComponent;
  let fixture: ComponentFixture<DbDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
