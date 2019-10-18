import { TestBed } from '@angular/core/testing';

import { MoviedbService } from './moviedb.service';

describe('MoviedbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoviedbService = TestBed.get(MoviedbService);
    expect(service).toBeTruthy();
  });
});
