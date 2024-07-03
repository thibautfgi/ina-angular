import { Component } from '@angular/core';
import { TASKS } from '../../mock-task';
import { Task } from '../../Task';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports:  [NgFor],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  tasks: Task[] = TASKS;

}
