import { TestBed } from '@angular/core/testing';
import { NodeService } from './nodes.service';

describe('NodeService Test Unitaire', () => {
  let service: NodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with the correct default state', () => {
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

  it('should update node state correctly', () => {
    const newState = { isMinLengthValid: true };
    service.updateNodeState(newState);
    service.nodeState$.subscribe(state => {
      expect(state.isMinLengthValid).toBe(true);
    });
  });

  it('should reset node state correctly', () => {
    service.resetNodeState();
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
