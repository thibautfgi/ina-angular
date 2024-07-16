import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ErrorService {

  // ce service fais le liens entre bodycomponent et errorcomponent et leurs envoie les info par abonnement


  private errorState = { // cree un objct errorState initialiser en all false
    showErrorChampsEmpty: false,
    showErrorLogin: false,
    showErrorSamePassword: false,
    showErrorSecurityPassword: false,
    showErrorMatchPassword: false,
    showSucces: false
  };

// $ convention, designe un observable, permet au autre
// parties de l'app peuvent s'abonner  
  private errorStateSubject = new BehaviorSubject(this.errorState);
  // A variant of Subject that requires an initial value and emits its current value whenever it is subscribed to.
  errorState$ = this.errorStateSubject.asObservable();  
  // on peut s'abonner a cette observable pour recevoir les maj de errorstate

  
  // fais une update du msg d'erreur ...??
  updateErrorState(newState: Partial<typeof this.errorState>) {
    this.errorState = { ...this.errorState, ...newState };
    this.errorStateSubject.next(this.errorState);
  }


  // remet a zero le champs erreur, le fait donc disparaitre
  resetErrorState() {
    this.errorState = {
      showErrorChampsEmpty: false,
      showErrorLogin: false,
      showErrorSamePassword: false,
      showErrorSecurityPassword: false,
      showErrorMatchPassword: false,
      showSucces: false
    };
    this.errorStateSubject.next(this.errorState); // next = emet cet etats de errorstate
  }

}
