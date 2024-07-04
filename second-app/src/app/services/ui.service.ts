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
  //Subject est une classe de RxJS qui permet d'émettre des événements et de souscrire à ces événements.
  //Ici, subject est utilisé pour émettre l'état de showAddTask chaque fois qu'il change.
  // Utilise subject.next pour émettre la nouvelle valeur de showAddTask à tous les abonnés.

  onToggle(): Observable<any> { //complicado
    return this.subject.asObservable();
  }

  // Renvoie un observable qui permet à d'autres composants de s'abonner aux changements de showAddTask.
  //asObservable est utilisé pour encapsuler le Subject en tant qu'Observable, 
  //empêchant ainsi les abonnés de modifier directement le Subject.


}
