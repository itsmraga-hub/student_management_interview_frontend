import { TestBed } from '@angular/core/testing';

import { SelectedStudentsService } from './selected-students.service';

describe('SelectedStudentsService', () => {
  let service: SelectedStudentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedStudentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
