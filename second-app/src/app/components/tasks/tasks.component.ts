import { Component, OnInit } from '@angular/core';
import { TASKS } from '../../mock-task';
import { Task } from '../../Task';
import { NgFor } from '@angular/common';
import { TaskItemComponent } from "../task-item/task-item.component";
import { TaskService } from '../../services/task.service';

@Component({
    selector: 'app-tasks',
    standalone: true,
    templateUrl: './tasks.component.html',
    styleUrl: './tasks.component.css',
    imports: [NgFor, TaskItemComponent]
})
export class TasksComponent implements OnInit {

  tasks: Task[] = TASKS;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
      this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }
}
