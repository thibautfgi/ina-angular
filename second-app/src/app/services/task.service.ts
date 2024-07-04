// services/task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../Task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "http://localhost:3000/tasks";

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }



  deleteTask(task: Task): Observable<Task> { 
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.delete<Task>(url);
  }


  updateReminder(task: Task): Observable<Task> {
    const url = `${this.apiUrl}/${task.id}`;
    return this.http.patch<Task>(url, { reminder: task.reminder }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
}

  addNewTask(task: Task): Observable<Task> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Task>(this.apiUrl, task, httpOptions);
  }


}
