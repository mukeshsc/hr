import { TestBed } from '@angular/core/testing';

import {CommonServiceService } from './comman-service.service';

describe('CommanServiceService', () => {
  let service: CommonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
