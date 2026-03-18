import { TestBed } from '@angular/core/testing';

import { HeroesIntegrationService } from './heroes-integration.service';

describe('HeroesIntegrationService', () => {
  let service: HeroesIntegrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesIntegrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
