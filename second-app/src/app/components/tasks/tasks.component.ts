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

  // permet d'injecter des services dans une classes ou autre configuration initial afin d'utiliser 
  // les méthodes de taskService
  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
      this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks)); 
      // subscribe : Déclenche l'exécution de l'observable et permet de 
      //définir des callbacks pour traiter la réponse (succès, erreur, etc.).
  }


  //Reçoit la tâche à supprimer.
  //Utilise TaskService pour envoyer une requête de suppression au serveur.
  //Attend la confirmation de la suppression via l'observable retourné par le service.
  //Met à jour la liste des tâches locale pour refléter cette suppression, en excluant la tâche supprimée.

  deleteTask(task : Task) {
    this.taskService
    .deleteTask(task).subscribe(
      () => (this.tasks = this.tasks.filter(t => t.id !== task.id)));
  }

  toggleReminder(task: Task): void {
    task.reminder = !task.reminder;
    this.taskService.updateReminder(task).subscribe();
  }

  
}
