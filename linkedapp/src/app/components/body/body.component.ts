import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NodeService } from '../../services/nodes.service';
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

  faLock = faLock; //logo cadena fontawesome
  faUser = faUser; // logo user fontawesome

  username!: string;
  oldPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  isMinLengthValid: boolean = false;
  isLowerCaseValid: boolean = false;
  isUpperCaseValid: boolean = false;
  isDigitValid: boolean = false;
  isSpecialCharValid: boolean = false;

  constructor(   // permet d'utiliser les service via dependency injection - DI
    private nodeService: NodeService,
    private errorService: ErrorService,
    private authService: AuthService
  ) {}

  ngOnInit() { // s'abonne au changement du service ce lance au demarrage
    this.nodeService.nodeState$.subscribe(state => {
      this.isMinLengthValid = state.isMinLengthValid;
      this.isLowerCaseValid = state.isLowerCaseValid;
      this.isUpperCaseValid = state.isUpperCaseValid;
      this.isDigitValid = state.isDigitValid;
      this.isSpecialCharValid = state.isSpecialCharValid;
    });
  }


  // quand le button valide est appuye, lance onSubmit()
  onSubmit() {

    // Réinitialiser les erreurs avant de vérifier les champs
    this.errorService.resetErrorState();

    // test si champs vide
    if (!this.username || !this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.errorService.updateErrorState({ showErrorChampsEmpty: true });
      return;
    }

    // Mettre à jour les états de validation
    this.updateNodes();

    // test si bon login + mdp combo
    this.authService.verifyAuth(this.username, this.oldPassword)
      .subscribe(
        response => {
          console.log('Credentials are valid');
          
          // test si new et old password identique
          if (this.newPassword === this.oldPassword) {
            this.errorService.updateErrorState({ showErrorSamePassword: true });
            return;
          }

          // test la securite du password
          if (!this.isMinLengthValid || !this.isLowerCaseValid || !this.isUpperCaseValid || !this.isDigitValid || !this.isSpecialCharValid) {
            this.errorService.updateErrorState({ showErrorSecurityPassword: true });
            return;
          }

          // test si newpassword et confirmnewpassword identique
          if (this.newPassword !== this.confirmPassword) {
            this.errorService.updateErrorState({ showErrorMatchPassword: true });
            return;
          }

          // Change le password et SUCCES reponse
          this.authService.changePassword(this.username, this.newPassword)
            .subscribe(
              response => {
                this.errorService.updateErrorState({ showSucces: true });
                
                // Reset les form 
                this.username = "";
                this.oldPassword = "";
                this.newPassword = "";
                this.confirmPassword = "";

                // Reset les nodes de validation
                this.nodeService.resetNodeState();
              }
            );
        },
        error => { // renvoie que le login et mdp ne match pas
          console.error('Invalid credentials', error);
          this.errorService.updateErrorState({ showErrorLogin: true });
        }
      );
  }

  updateNodes() { // Mettre à jour les états de validation des nodes, test les conditions et envoie des booleans
    const password = this.newPassword; // Utiliser le mot de passe actuel
    this.nodeService.updateNodeState({
      isMinLengthValid: password.length >= 8,
      isLowerCaseValid: /[a-z]/.test(password),
      isUpperCaseValid: /[A-Z]/.test(password),
      isDigitValid: /[0-9]/.test(password),
      isSpecialCharValid: /[@$%*=\/\-+?!&"'()-_°:;,.§µ£|#]/.test(password)
    });
  }
}
