import { TestBed } from '@angular/core/testing';

import { HeaderTogglerServiceService } from './header-toggler-service.service';

describe('HeaderTogglerServiceService', () => {
  let service: HeaderTogglerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderTogglerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
