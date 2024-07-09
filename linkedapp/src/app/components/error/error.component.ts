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


  export class ErrorComponent implements OnInit {
    showErrorChampsEmpty: boolean = false;
    showErrorLogin: boolean = false;
    showErrorSecurityPassword: boolean = false;
    showErrorMatchPassword: boolean = false;

    constructor(private errorService: ErrorService) {}

    ngOnInit() {
        this.errorService.errorState$.subscribe(state => {
        this.showErrorChampsEmpty = state.showErrorChampsEmpty;
        this.showErrorLogin = state.showErrorLogin;
        this.showErrorSecurityPassword = state.showErrorSecurityPassword;
        this.showErrorMatchPassword = state.showErrorMatchPassword;
      });
    }


  }


