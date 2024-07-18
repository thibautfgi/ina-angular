import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoComponent } from './components/video/video.component';


// component principal de l'app

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VideoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  
}
