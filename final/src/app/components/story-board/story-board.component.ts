import { Component, OnInit } from '@angular/core';
import { FramesDrawerComponent } from '../frames-drawer/frames-drawer.component';
import { NgFor } from '@angular/common';
import { LibavInitService } from '../../services/libav-init.service';

@Component({
  selector: 'app-story-board',
  standalone: true,
  imports: [FramesDrawerComponent, NgFor],
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.css']
})
export class StoryBoardComponent implements OnInit {
  frames: any[] = [];
  moduloNumber!: number;

  constructor(private libavInitService: LibavInitService) {}

  ngOnInit() {
    this.libavInitService.frames$.subscribe(frames => {
      this.frames = frames;
    });

    this.libavInitService.moduloNumber$.subscribe(moduloNumber => {
      this.moduloNumber = moduloNumber;
    });
  }
}
