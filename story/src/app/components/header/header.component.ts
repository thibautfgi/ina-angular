import { Component, Input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { LibavInitService } from '../../services/libav-init.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {


  @Input() videoName$: Observable<string>;

  constructor(private libavInitService: LibavInitService) {
    this.videoName$ = this.libavInitService.videoName$; // pour donne une info utilisable
  }

}
