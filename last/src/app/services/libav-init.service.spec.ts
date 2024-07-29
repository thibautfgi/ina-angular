import { TestBed } from '@angular/core/testing';

import { LibavInitService } from './libav-init.service';

describe('LibavInitService', () => {
  let service: LibavInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibavInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
