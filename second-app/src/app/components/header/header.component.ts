import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  title: string = 'second-app';
  showAddTask: Boolean = false;
  subscription!: Subscription;


  // permet d'utiliser ces données dans le html component lier a cette page 
  // ici avec des {{ title }}

  constructor(private uiService:UiService) {
    this.subscription = this.uiService
    .onToggle()
    .subscribe((value) => (this.showAddTask = value))
   } // RUN quand un object ou un component est initialise

  ngOnInit() : void { // ce lance qd le code commence
  }

  toggleAddTask() {
    this.uiService.toggleAddTask();
  }

}
