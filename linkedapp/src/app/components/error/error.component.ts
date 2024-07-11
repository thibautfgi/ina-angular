  import { Component, Input, OnInit } from '@angular/core';
  import { NgIf } from '@angular/common';
  import { ErrorService } from '../../services/error.service';


  @Component({
    selector: 'app-error',
    standalone: true,
    imports: [NgIf],
    templateUrl: './error.component.html',
    styleUrl: './error.component.css'
  })


  export class ErrorComponent implements OnInit { //  place les booleans a zero et affiche donc aucun msg d'erreur
    showErrorChampsEmpty: boolean = false;
    showErrorLogin: boolean = false;
    showErrorSamePassword: boolean = false;
    showErrorSecurityPassword: boolean = false;
    showErrorMatchPassword: boolean = false;
    showSucces: boolean = false;
   

    constructor(private errorService: ErrorService) {} //utilise les fct d'error service

    ngOnInit() {
        this.errorService.errorState$.subscribe(state => { // suscribe aun service error et observe les changements des booleans pour les rendre dans le components
        this.showErrorChampsEmpty = state.showErrorChampsEmpty;
        this.showErrorLogin = state.showErrorLogin;
        this.showErrorSamePassword = state.showErrorSamePassword;
        this.showErrorSecurityPassword = state.showErrorSecurityPassword;
        this.showErrorMatchPassword = state.showErrorMatchPassword;
        this.showSucces = state.showSucces;
      });
    }


  }


