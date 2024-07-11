import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-node',
  standalone: true,
  imports: [FontAwesomeModule, NgStyle],
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent {
  @Input() text!: string; // le txt lier a la node
  @Input() isTrue!: boolean; // le booleans qui change la couleur de la node

  FaCircle = faCircle; // fontawesome logo cercle = la node

  get color() { // Si la condition est remplie, vert, sinon rouge
    return this.isTrue ? 'rgba(0,171,202)' : 'red'; 
  }
}
