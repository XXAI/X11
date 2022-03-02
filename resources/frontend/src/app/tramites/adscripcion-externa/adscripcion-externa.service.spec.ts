import { TestBed } from '@angular/core/testing';

import { AdscripcionExternaService } from './adscripcion-externa.service';

describe('AdscripcionExternaService', () => {
  let service: AdscripcionExternaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdscripcionExternaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
