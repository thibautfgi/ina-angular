import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HousingLocationComponent } from './housing-location/housing-location.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    HousingLocationComponent
  ],
  //templateUrl: './app.component.html',
  template: `
  <main>
    <header class="brand-name">
      <img class="brand-logo" src="/picture1.jpg" alt="logo" height="200px" aria-hidden="true">
    </header>
    <section class="content">
      <app-home></app-home>
    </section>
  </main>
`,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ina-angular by tibo';
}
