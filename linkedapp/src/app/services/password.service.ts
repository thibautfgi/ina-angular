import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ValidationService { // etats de validation initial de notre formulaire
  private validationState = {
    isMinLengthValid: false,
    isLowerCaseValid: false,
    isUpperCaseValid: false,
    isDigitValid: false,
    isSpecialCharValid: false
  };

  private validationStateSubject = new BehaviorSubject(this.validationState); //envoie a tt les abonnes

  validationStateObservable = this.validationStateSubject.asObservable(); // permet de s'abonner 

  updateValidationState(newState: Partial<typeof this.validationState>) {
    this.validationState = { ...this.validationState, ...newState }; // ?? sa marche mais ??
    this.validationStateSubject.next(this.validationState); // prend la donne actualise et la donne au abonne
  }
}