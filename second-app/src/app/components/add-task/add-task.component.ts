import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Task } from '../../Task';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {

  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();


  text!: string;
  day!: string;
  reminder: boolean= false; // default value
  showAddTask!: boolean;
  subscription!: Subscription;

  constructor(private uiService:UiService) {
    this.subscription = this.uiService
    .onToggle()
    .subscribe((value) => (this.showAddTask = value))
   } // RUN quand un object ou un component est initialise


  onSubmit() {
    if(!this.text){
      alert("please add a task!") // envoie une alerte si vide
      return;
    }
    const newTask = {
      text: this.text,
      day: this.day,
      reminder: this.reminder
    }

    this.onAddTask.emit(newTask);
   

    this.text= "";
    this.day= "";
    this.reminder=false; // remet apres emition a zero les cases 
  }




}







