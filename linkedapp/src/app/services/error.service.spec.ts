import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';

describe('ErrorService Test Unitaire', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('TEST INITIAL si Error Service est crée', () => {
    expect(service).toBeTruthy();
  });

  it('TEST FONCTION password security initialiser en false', () => {
    // regarde si erreorstate est bien en false de base
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

  it('TEST FONCTION change le msg d\'erreur corectement ', () => {
    // test, une valeur changer
    const newState = { showErrorChampsEmpty: true };
    // change un state
    service.updateErrorState(newState);
    // s'abonne au changement et regarde si le msg d'erreur a changer
    service.errorState$.subscribe(state => {
      expect(state.showErrorChampsEmpty).toBe(true);
    });
  }); 

  // 
  it('TEST FONCTION reset en false le msg d\'erreur', () => {

    // exemple test
    service.updateErrorState({
      showErrorChampsEmpty: true,
      showErrorLogin: true,
      showErrorSamePassword: true,
      showErrorSecurityPassword: true,
      showErrorMatchPassword: true,
      showSucces: true,
    });
    // remet tt en false
    service.resetErrorState();
    // s'abonne au changement de test et regarde si il est bien false partout
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
