import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


title: string = 'Angul-app 2';
  showAddTask: Boolean = false;
  subscription!: Subscription;


  // permet d'utiliser ces données dans le html component lier a cette page 
  // ici avec des {{ title }}

  constructor(private uiService:UiService, private router: Router) { //cette ligne permet l'acces au import
    this.subscription = this.uiService
    .onToggle()
    .subscribe((value) => (this.showAddTask = value))
   } // RUN quand un object ou un component est initialise

  ngOnInit() : void { // ce lance qd le code commence
  }

  toggleAddTask() {
    this.uiService.toggleAddTask();
  }

  hasRoute(route: string) {
    return this.router.url === route;
  }

}
