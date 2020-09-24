import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JornadaDialogComponent } from './jornada-dialog.component';

describe('JornadaDialogComponent', () => {
  let component: JornadaDialogComponent;
  let fixture: ComponentFixture<JornadaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JornadaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JornadaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
