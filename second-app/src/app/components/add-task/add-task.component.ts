import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Task } from '../../Task';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {

  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();


  text!: string;
  day!: string;
  reminder: boolean= false; // default value




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






