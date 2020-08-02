import { TestBed } from '@angular/core/testing';

import { DeleteFileService } from './delete-file.service';

describe('DeleteFileService', () => {
  let service: DeleteFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
