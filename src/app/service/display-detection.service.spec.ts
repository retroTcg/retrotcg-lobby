import { TestBed } from '@angular/core/testing';

import { DisplayDetectionService } from './display-detection.service';

describe('DisplayDetectionService', () => {
  let service: DisplayDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
