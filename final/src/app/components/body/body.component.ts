import { Component } from '@angular/core';
import { asyncScheduler, BehaviorSubject, Observable } from 'rxjs';
import { FramesDrawersService } from '../../services/frames-drawers.service';
import { AsyncPipe } from '@angular/common';
import { FramesDrawerComponent } from "../frames-drawer/frames-drawer.component";
import { StoryBoardComponent } from '../story-board/story-board.component';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [AsyncPipe, FramesDrawerComponent, StoryBoardComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})

export class BodyComponent {




  //video name part
  videoName$: Observable<string>;

  constructor(private framesDrawersService : FramesDrawersService) {
    this.videoName$ = this.framesDrawersService.videoName$;
  }

  updateVideoName(newName: string): void {
    this.framesDrawersService.setVideoName(newName);
  }

}
