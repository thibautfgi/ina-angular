import { TestBed } from '@angular/core/testing';
import { NodeService } from './nodes.service';

describe('NodeService Test Unitaire', () => {
  let service: NodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeService);
  });

  it('TEST INITIAL si Nodes Service est crée', () => {
    expect(service).toBeTruthy();
  });

  it('TEST FONCTION node state est initialiser en false', () => {
    //test
    service.nodeState$.subscribe(state => {
      expect(state).toEqual({
        isMinLengthValid: false,
        isLowerCaseValid: false,
        isUpperCaseValid: false,
        isDigitValid: false,
        isSpecialCharValid: false,
      });
    });
  });

  it('TEST FONCTION change la node corectement', () => {
    //test
    const newState = { isMinLengthValid: true };
    // mise a jour
    service.updateNodeState(newState);
    // regarde si la mise a jour a marcher
    service.nodeState$.subscribe(state => {
      expect(state.isMinLengthValid).toBe(true);
    });
  });

  it('TEST FONCTION reset en false la node', () => {
    // test
    service.updateNodeState({
      isMinLengthValid: true,
      isLowerCaseValid: true,
      isUpperCaseValid: true,
      isDigitValid: true,
      isSpecialCharValid: true,
    });
    //reset
    service.resetNodeState();
    // verifie si le reset a eus lieu
    service.nodeState$.subscribe(state => {
      expect(state).toEqual({
        isMinLengthValid: false,
        isLowerCaseValid: false,
        isUpperCaseValid: false,
        isDigitValid: false,
        isSpecialCharValid: false,
      });
    });
  });
});
