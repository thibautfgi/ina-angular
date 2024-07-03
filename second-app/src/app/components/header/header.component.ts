import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  title: string = 'second-app';
  // permet d'utiliser ces données dans le html component lier a cette page 
  // ici avec des {{ title }}

  constructor() { } // RUN quand un object ou un component est initialise

  ngOnInit() : void { // ce lance qd le code commence
  }

  toggleAddTask() {
    console.log("toggle")
  }

}
