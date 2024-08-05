import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { LibavInitService } from '../../services/libav-init.service';
import { combineLatest, Observable } from 'rxjs';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-story-board',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './story-board.component.html',
  styleUrls: ['./story-board.component.css']
})
export class StoryBoardComponent implements OnInit {

  @Input() framesNumber$: Observable<number>;
  @Input() videoFrames$!: Observable<any>;
  @Input() customHeight$: Observable<number>;
  @Input() customWidth$: Observable<number>;
  @Input() fps$: Observable<number>;

  private fps: number = 25; // default value, will be updated from fps$
  private previousFrameCount: number = 0; // Track the number of previously drawn frames

  constructor(
    private libavInitService: LibavInitService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.framesNumber$ = this.libavInitService.framesNumber$;
    this.videoFrames$ = this.libavInitService.videoFrames$;
    this.customHeight$ = this.libavInitService.customHeight$;
    this.customWidth$ = this.libavInitService.customWidth$;
    this.fps$ = this.libavInitService.fps$;
  }

  // init en meme temps tt les donnes suscribe
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      combineLatest([
        this.fps$,
        this.framesNumber$,
        this.videoFrames$,
        this.customHeight$,
        this.customWidth$,
      ]).subscribe(([fps, framesNumber, videoFrames, customHeight, customWidth]) => {
        this.fps = fps;
        if (framesNumber !== null && videoFrames !== null && videoFrames.length > 0) {
          // si on a des data, lance le processus de draw
          this.buildStoryBoard(videoFrames, customHeight, customWidth, fps);
        }
      });
    } else {
      console.warn('ngOnInit called in non-browser environment');
    }
  }

  // build le story board
  buildStoryBoard(videoFrames: any[], customHeight: number, customWidth: number, fps: number): void {
    const storyboardContainer: HTMLElement = document.getElementById('storyContainer') as HTMLElement;
    if (!storyboardContainer) {
      console.error('Storyboard container not found');
      return;
    }

    const frameToPrint = videoFrames.length; // permet de ne pas redessiner tt les frames plusieurs fois

    // 5 img par ligne
    for (let index = this.previousFrameCount; index < frameToPrint; index++) {
      if (index % 5 === 0) {
        const row = document.createElement('div');
        row.classList.add('d-flex', 'flex-row', 'mb-3');
        storyboardContainer.appendChild(row);
      }

      const rows = storyboardContainer.getElementsByClassName('d-flex flex-row mb-3');
      const row = rows[rows.length - 1];

      const col = document.createElement('div');
      col.classList.add('flex-fill');

      const timestamp = this.calculateTimestamp(videoFrames[index].frameNumber, fps);
      const formattedTimestamp = this.formatTimestamp(timestamp);
      const canvas = this.drawFrame(videoFrames[index].frame, customWidth, customHeight, formattedTimestamp);
      if (canvas) {
        col.appendChild(canvas);
      }

      row.appendChild(col);
    }

    this.previousFrameCount = frameToPrint;
  }

  // dessine la frame
  drawFrame(videoFrame: VideoFrame, customWidth: number, customHeight: number, timestamp: string): HTMLCanvasElement | null {
    if (!videoFrame) {
      console.error('Display frame not found');
      return null;
    }

    // cree un can
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = customWidth;
    canvas.height = customHeight;

    createImageBitmap(videoFrame).then(imageBitmap => {
      ctx.drawImage(imageBitmap, 0, 0, customWidth, customHeight);
      // Draw the timestamp on the image
      ctx.font = '16px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.strokeText(timestamp, 10, 20);
      ctx.fillText(timestamp, 10, 20);
    }).catch(error => {
      console.error('Error creating image bitmap:', error);
    });

    return canvas;
  }

  // calcule le timestamp pour une frame donnée
  calculateTimestamp(frameNumber: number, fps: number): number {
    return frameNumber / fps;
  }

  // formate le timestamp en heure:minute:seconde:c
  formatTimestamp(timestamp: number): string {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    const milliseconds = Math.floor((timestamp % 1) * 100); //homemade c

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}.${this.pad(milliseconds, 2)}`;
  }

  // ajout de zéros devant le nombre
  pad(num: number, size: number = 2): string {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }
}
