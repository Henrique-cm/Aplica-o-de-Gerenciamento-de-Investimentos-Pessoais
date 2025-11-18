import { TestBed } from '@angular/core/testing';

import { Objetivo } from './objetivo';

describe('Objetivo', () => {
  let service: Objetivo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Objetivo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
