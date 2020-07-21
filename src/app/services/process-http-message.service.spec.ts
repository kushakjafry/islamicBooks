import { TestBed } from '@angular/core/testing';

import { ProcessHttpMessageService } from './process-http-message.service';

describe('ProcessHttpMessageService', () => {
  let service: ProcessHttpMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHttpMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
