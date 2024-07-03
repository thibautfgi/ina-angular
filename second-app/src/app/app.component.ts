import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from './services/task.service'; // Adjust the path as necessary

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, TasksComponent, HttpClientModule], // Include HttpClientModule here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [TaskService] // Provide TaskService here
})
export class AppComponent {
  constructor(private taskService: TaskService) {
    this.taskService.getTasks().subscribe(tasks => {
      console.log(tasks);
    });
  }
}
