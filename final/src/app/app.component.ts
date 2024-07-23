import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FramesDrawerComponent } from './components/frames-drawer/frames-drawer.component';
import { BodyComponent } from "./components/body/body.component";

declare var LibAV: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FramesDrawerComponent, BodyComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
