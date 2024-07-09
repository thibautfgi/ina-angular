import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/password.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [FormsModule, FontAwesomeModule, ErrorComponent],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {

  faLock = faLock;
  faUser = faUser;
  username!: string;
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  constructor(private validationService: ValidationService) {}

  onSubmit() {
    if (!this.username || !this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert("champs vide!"); // TODO: autre systeme que une alerte
      return;
    } else {
      this.username = "";
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
      
      // Réinitialiser les états de validation
      this.validationService.resetValidationState();
    }
  }

  updateValidationStates() {
    const password = this.newPassword || ''; // Utiliser le mot de passe actuel
    this.validationService.updateValidationState({
      isMinLengthValid: password.length >= 8,
      isLowerCaseValid: /[a-z]/.test(password),
      isUpperCaseValid: /[A-Z]/.test(password),
      isDigitValid: /[0-9]/.test(password),
      isSpecialCharValid: /[@$%*=\/\-+?!]/.test(password) // TODO: augmenter la liste
    });
  }
}
