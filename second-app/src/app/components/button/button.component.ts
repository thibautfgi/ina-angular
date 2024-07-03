import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent implements OnInit {

  @Input() text!: string;
  @Input() color!: string;
  @Output() btnClick = new EventEmitter() // permet de cree un event sur le button qui sera ensuite reutilisable

constructor() { }

onClick() {
  this.btnClick.emit();
}

ngOnInit(): void { }

}
