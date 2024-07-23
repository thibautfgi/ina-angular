import { Component, OnInit } from '@angular/core';
import { FramesDrawerComponent } from '../frames-drawer/frames-drawer.component';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-story-board',
  standalone: true,
  imports: [FramesDrawerComponent],
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.css']
})
export class StoryBoardComponent {
}
