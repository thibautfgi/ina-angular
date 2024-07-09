import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorState = {
    showErrorChampsEmpty: false,
    showErrorLogin: false,
    showErrorSamePassword: false,
    showErrorSecurityPassword: false,
    showErrorMatchPassword: false,
    showSucces: false
  };


  private errorStateSubject = new BehaviorSubject(this.errorState);
  errorState$ = this.errorStateSubject.asObservable(); // $ convention, designe un observable, permet au autre
  // parties de l'app peuvent s'abonner  

  updateErrorState(newState: Partial<typeof this.errorState>) {
    this.errorState = { ...this.errorState, ...newState };
    this.errorStateSubject.next(this.errorState);
  }


  resetErrorState() {
    this.errorState = {
      showErrorChampsEmpty: false,
      showErrorLogin: false,
      showErrorSamePassword: false,
      showErrorSecurityPassword: false,
      showErrorMatchPassword: false,
      showSucces: false
    };
    this.errorStateSubject.next(this.errorState);
  }

}
