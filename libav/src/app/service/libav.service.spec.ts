import { TestBed } from '@angular/core/testing';

import { LibavService } from './libav.service';

describe('LibavService', () => {
  let service: LibavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
