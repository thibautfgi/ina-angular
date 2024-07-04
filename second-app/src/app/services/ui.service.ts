import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private showAddTask: boolean= false;
  private subject = new Subject<any>();

  constructor() { }

  toggleAddTask(): void {
    this.showAddTask = !this.showAddTask; // l'inverse
    this.subject.next(this.showAddTask) // deviens la valeur a devenir ces a dire l'inverse

  }

  onToggle(): Observable<any> { //complicado
    return this.subject.asObservable();
  }


}
