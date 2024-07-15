import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// ce service fais le liens entre les nodes et le bodycomponent/ header component 

export class NodeService { // etats des nodes initial de notre formulaire
  private nodeState = {
    isMinLengthValid: false,
    isLowerCaseValid: false,
    isUpperCaseValid: false,
    isDigitValid: false,
    isSpecialCharValid: false
  };

  private nodeStateSubject = new BehaviorSubject(this.nodeState); //envoie a tt les abonnes

  nodeState$ = this.nodeStateSubject.asObservable(); // permet de s'abonner 

  updateNodeState(newState: Partial<typeof this.nodeState>) {
    this.nodeState = { ...this.nodeState, ...newState }; // ?? sa marche mais ??
    this.nodeStateSubject.next(this.nodeState); // prend la donne actualise et la donne au abonne
  }

  // reset les nodes en rouges
  resetNodeState() {
    this.nodeState = {
      isMinLengthValid: false,
      isLowerCaseValid: false,
      isUpperCaseValid: false,
      isDigitValid: false,
      isSpecialCharValid: false
    };
    this.nodeStateSubject.next(this.nodeState);
  }

  
}
