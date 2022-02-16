import { TestBed } from '@angular/core/testing';

import { AdscripcionService } from './adscripcion.service';

describe('AdscripcionService', () => {
  let service: AdscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
