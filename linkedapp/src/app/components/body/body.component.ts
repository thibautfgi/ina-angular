import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/password.service';
import { ErrorService } from '../../services/error.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, ErrorComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  faLock = faLock;
  faUser = faUser;

  username!: string;
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  isMinLengthValid: boolean = false;
  isLowerCaseValid: boolean = false;
  isUpperCaseValid: boolean = false;
  isDigitValid: boolean = false;
  isSpecialCharValid: boolean = false;

  constructor(private validationService: ValidationService, private errorService: ErrorService) {}

  ngOnInit() { // s'abonne au changement du service
    this.validationService.validationStateObservable.subscribe(state => {
      this.isMinLengthValid = state.isMinLengthValid;
      this.isLowerCaseValid = state.isLowerCaseValid;
      this.isUpperCaseValid = state.isUpperCaseValid;
      this.isDigitValid = state.isDigitValid;
      this.isSpecialCharValid = state.isSpecialCharValid;
    });
  }

  onSubmit() {
    // Réinitialiser les erreurs avant de vérifier les champs
    this.errorService.resetErrorState();

    // test erreur champs vide
    if (!this.username || !this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.errorService.updateErrorState({ showErrorChampsEmpty: true });
      return;
    }

    // Mettre à jour les états de validation
    this.updateValidationStates();


        // Logic pour vérifier login et password
    // TODO: Ajouter la logique pour vérifier login et password
    // if (loginCheckFails) {
    //   this.errorService.updateErrorState({ showErrorLogin: true });
    //   return;
    // }


      // test erreur same password
      if (this.newPassword === this.oldPassword ) {
        this.errorService.updateErrorState({ showErrorSamePassword: true });
        return;
      }


    // test erreur securite mdp
    if (!this.isMinLengthValid || !this.isLowerCaseValid || !this.isUpperCaseValid || !this.isDigitValid || !this.isSpecialCharValid) {
      this.errorService.updateErrorState({ showErrorSecurityPassword: true });
      return;
    }


    // test erreur password matching
    if (this.newPassword !== this.confirmPassword) {
      this.errorService.updateErrorState({ showErrorMatchPassword: true });
      return;
    }


    // SUCCES Ici, envoyez les données au serveur

    this.username = "";
    this.oldPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";

    // Réinitialiser les états de validation
    this.validationService.resetValidationState();
  }

  updateValidationStates() {
    const password = this.newPassword || ''; // Utiliser le mot de passe actuel
    this.validationService.updateValidationState({
      isMinLengthValid: password.length >= 8,
      isLowerCaseValid: /[a-z]/.test(password),
      isUpperCaseValid: /[A-Z]/.test(password),
      isDigitValid: /[0-9]/.test(password),
      isSpecialCharValid: /[@$%*=\/\-+?!]/.test(password)
    });
  }
}
