import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/password.service';
import { ErrorService } from '../../services/error.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { ErrorComponent } from '../error/error.component';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private validationService: ValidationService,
    private errorService: ErrorService,
    private authService: AuthService
  ) {}

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

    // Verify credentials and change password
    this.authService.verifyAuth(this.username, this.oldPassword)
      .subscribe(
        response => {
          console.log('Credentials are valid');
          
          // Check if new password matches old password
          if (this.newPassword === this.oldPassword) {
            this.errorService.updateErrorState({ showErrorSamePassword: true });
            return;
          }

          // Check password security
          if (!this.isMinLengthValid || !this.isLowerCaseValid || !this.isUpperCaseValid || !this.isDigitValid || !this.isSpecialCharValid) {
            this.errorService.updateErrorState({ showErrorSecurityPassword: true });
            return;
          }

          // Check erreur newpassword et confirmpassword pareil
          if (this.newPassword !== this.confirmPassword) {
            this.errorService.updateErrorState({ showErrorMatchPassword: true });
            return;
          }

          // Change le password et SUCCES reponse
          this.authService.changePassword(this.username, this.oldPassword, this.newPassword)
            .subscribe(
              response => {
                this.errorService.updateErrorState({ showSucces: true });
                
                // Reset form fields
                this.username = "";
                this.oldPassword = "";
                this.newPassword = "";
                this.confirmPassword = "";

                // Reset validation states
                this.validationService.resetValidationState();
              },
              error => {
                console.error('Password change failed', error);
                this.errorService.updateErrorState({ showErrorLogin: true });
              }
            );
        },
        error => { //erreur LOGIN msg
          console.error('Invalid credentials', error);
          this.errorService.updateErrorState({ showErrorLogin: true });
        }
      );
  }

  updateValidationStates() {
    const password = this.newPassword || ''; // Utiliser le mot de passe actuel
    this.validationService.updateValidationState({
      isMinLengthValid: password.length >= 8,
      isLowerCaseValid: /[a-z]/.test(password),
      isUpperCaseValid: /[A-Z]/.test(password),
      isDigitValid: /[0-9]/.test(password),
      isSpecialCharValid: /[@$%*=\/\-+?!&"'()-_°:;,.§µ£|#]/.test(password)
    });
  }
}
