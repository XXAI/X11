import { TestBed } from '@angular/core/testing';

import { CuestionarioService } from './cuestionario.service';

describe('CuestionarioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuestionarioService = TestBed.get(CuestionarioService);
    expect(service).toBeTruthy();
  });
});
