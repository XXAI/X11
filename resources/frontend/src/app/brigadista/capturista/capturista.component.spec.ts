import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapturistaComponent } from './capturista.component';

describe('CapturistaComponent', () => {
  let component: CapturistaComponent;
  let fixture: ComponentFixture<CapturistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapturistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
