import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroParticularComponent } from './registro-particular.component';

describe('RegistroParticularComponent', () => {
  let component: RegistroParticularComponent;
  let fixture: ComponentFixture<RegistroParticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroParticularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
