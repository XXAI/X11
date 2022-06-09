import { TestBed } from '@angular/core/testing';

import { ComisionSindicalService } from './comision-sindical.service';

describe('ComisionSindicalService', () => {
  let service: ComisionSindicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComisionSindicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
