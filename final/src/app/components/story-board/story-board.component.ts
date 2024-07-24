import { Component, Input, OnInit } from '@angular/core';
import { FramesDrawerComponent } from '../frames-drawer/frames-drawer.component';
import { AsyncPipe, NgFor } from '@angular/common';
import { LibavInitService } from '../../services/libav-init.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-story-board',
  standalone: true,
  imports: [FramesDrawerComponent, AsyncPipe],
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.css']
})
export class StoryBoardComponent {

   @Input() framesNumber$: Observable<number> | undefined;



  constructor(
    private libavInitService: LibavInitService,
  ) {
    this.framesNumber$ = this.libavInitService.framesNumber$;
  }
}
