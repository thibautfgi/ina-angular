import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../../services/password.service';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent {

  username!: string;
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  constructor(private validationService: ValidationService) {}

  onSubmit() {
    if (!this.username || !this.oldPassword || !this.newPassword || !this.confirmPassword) {
      alert("champs vide!"); // envoie une alerte si vide // TODO: autre systeme que une alerte
      return;
    } else {
      this.username = "";
      this.oldPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
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
