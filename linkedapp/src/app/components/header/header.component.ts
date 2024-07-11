import { Component, OnInit } from '@angular/core';
import { NodeComponent } from '../node/node.component';
import { ValidationService } from '../../services/password.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NodeComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // declare a zero les nodes
  isMinLengthValid = false;
  isLowerCaseValid = false;
  isUpperCaseValid = false;
  isDigitValid = false;
  isSpecialCharValid = false;

  constructor(private validationService: ValidationService) {} // import le service

  ngOnInit() { // ce lance a l initialisation et s'abonne au changement des nodes
    this.validationService.validationStateObservable.subscribe(state => {
      this.isMinLengthValid = state.isMinLengthValid;
      this.isLowerCaseValid = state.isLowerCaseValid;
      this.isUpperCaseValid = state.isUpperCaseValid;
      this.isDigitValid = state.isDigitValid;
      this.isSpecialCharValid = state.isSpecialCharValid;
    });
  }
}
