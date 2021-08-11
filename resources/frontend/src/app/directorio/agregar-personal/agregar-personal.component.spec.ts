import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPersonalComponent } from './agregar-personal.component';

describe('AgregarPersonalComponent', () => {
  let component: AgregarPersonalComponent;
  let fixture: ComponentFixture<AgregarPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
