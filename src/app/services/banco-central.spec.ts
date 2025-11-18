import { TestBed } from '@angular/core/testing';

import { BancoCentral } from './banco-central';

describe('BancoCentral', () => {
  let service: BancoCentral;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BancoCentral);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
