import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGeneralComponent } from './registro-general.component';

describe('RegistroGeneralComponent', () => {
  let component: RegistroGeneralComponent;
  let fixture: ComponentFixture<RegistroGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
