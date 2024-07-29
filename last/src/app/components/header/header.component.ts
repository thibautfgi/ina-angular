import { Component, PLATFORM_ID } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { LibavInitService } from '../../services/libav-init.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  videoName$: Observable<string>;



  constructor(
    private libavInitService: LibavInitService,
  ) {
    this.videoName$ = this.libavInitService.videoName$;
  }
}
