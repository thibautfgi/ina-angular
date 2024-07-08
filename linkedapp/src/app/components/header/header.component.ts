import { Component } from '@angular/core';
import { NodeComponent } from '../node/node.component';
 
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NodeComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
