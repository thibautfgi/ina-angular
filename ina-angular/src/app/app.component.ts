import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HousingLocationComponent } from './housing-location/housing-location.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HomeComponent,
    HousingLocationComponent,
    HomeComponent,
    RouterModule
  ],
  //templateUrl: './app.component.html',
  template: `
  <main>
    <header class="brand-name">
      <img class="brand-logo" src="/picture1.jpg" alt="logo" height="200px" aria-hidden="true">
    </header>
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </main>
`,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ina-angular by tibo';
}
