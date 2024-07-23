import { TestBed } from '@angular/core/testing';

import { FramesDrawersService } from './frames-drawers.service';

describe('FramesDrawersService', () => {
  let service: FramesDrawersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FramesDrawersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
