import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';

describe('ErrorService Test Unitaire', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with the correct default error state', () => {
    service.errorState$.subscribe(state => {
      expect(state).toEqual({
        showErrorChampsEmpty: false,
        showErrorLogin: false,
        showErrorSamePassword: false,
        showErrorSecurityPassword: false,
        showErrorMatchPassword: false,
        showSucces: false,
      });
    });
  });

  it('should update error state correctly', () => {
    const newState = { showErrorChampsEmpty: true };
    service.updateErrorState(newState);
    service.errorState$.subscribe(state => {
      expect(state.showErrorChampsEmpty).toBe(true);
    });
  });

  it('should reset error state correctly', () => {
    service.resetErrorState();
    service.errorState$.subscribe(state => {
      expect(state).toEqual({
        showErrorChampsEmpty: false,
        showErrorLogin: false,
        showErrorSamePassword: false,
        showErrorSecurityPassword: false,
        showErrorMatchPassword: false,
        showSucces: false,
      });
    });
  });
});
