import { TestBed } from '@angular/core/testing';

import { ReincorporacionService } from './reincorporacion.service';

describe('ReincorporacionService', () => {
  let service: ReincorporacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReincorporacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
