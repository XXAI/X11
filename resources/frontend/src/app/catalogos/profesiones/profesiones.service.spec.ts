import { TestBed } from '@angular/core/testing';

import { ProfesionesService } from './profesiones.service';

describe('ProfesionesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfesionesService = TestBed.get(ProfesionesService);
    expect(service).toBeTruthy();
  });
});
